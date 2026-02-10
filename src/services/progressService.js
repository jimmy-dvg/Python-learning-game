/**
 * Progress Service
 * Handles recording challenge results and updating user stats.
 */

import { supabase, isSupabaseConfigured } from './supabaseClient.js';

/**
 * Records a challenge submission and updates state.
 */
export async function recordProgress({ userId, challengeId, result, xpEarned }) {
    if (!isSupabaseConfigured) throw new Error('Supabase not initialized');
    // 1. Validate Input
    if (!userId || !challengeId) {
        throw new Error('Missing required progress data (userId or challengeId)');
    }

    // 2. Log full submission for audit
    // In production, this ensures we have a history regardless of whether they "passed"
    const { error: submissionError } = await supabase
        .from('submissions')
        .insert([{
            user_id: userId,
            challenge_id: challengeId,
            code_submitted: result.code,
            passed: result.success,
            results: result.tests
        }]);

    if (submissionError) console.error('Failed to log submission:', submissionError);

    // 3. If passed, execute atomic update via RPC
    if (result.success) {
        const { data, error } = await supabase.rpc('fn_complete_challenge', {
            p_user_id: userId,
            p_challenge_id: challengeId,
            p_xp_earned: xpEarned,
            p_results: JSON.stringify(result.tests)
        });

        if (error) throw error;
        return data[0]; // Returns {new_xp, total_completed}
    }

    return { message: 'Submission recorded, but challenge not completed.' };
}

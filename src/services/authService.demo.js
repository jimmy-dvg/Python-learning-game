// Copilot: Implement a Demo login feature using Supabase.
import { supabase } from './supabaseClient.js';

/**
 * Signs in using a predefined demo account.
 * SECURITY: Demo credentials must be stored in .env and SHOULD NOT have administrative privileges.
 * This function ensures a demo profile exists with the correct flags.
 */
export async function demoLogin() {
    const email = import.meta.env.VITE_DEMO_EMAIL;
    const password = import.meta.env.VITE_DEMO_PASSWORD;

    if (!email || !password) {
        throw new Error('Demo credentials not configured in environment.');
    }

    // 1. Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const user = data.user;

    // 2. Ensure Demo Profile exists and is flagged
    // UPSERT ensures the profile is always correctly tagged as a demo account
    const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ 
            id: user.id, 
            display_name: 'Demo Hero', 
            is_demo: true,
            xp: 0 
        }, { onConflict: 'id' });

    if (profileError) console.error('Demo profile sync failed:', profileError);

    return user;
}

/**
 * Synchronizes any locally stored progress to the server upon login.
 * This is useful if the user played offline or as a guest before logging in.
 */
export async function syncLocalProgressToServer(userId) {
    const localData = localStorage.getItem('py_quest_local_progress');
    if (!localData) return;

    try {
        const progress = JSON.parse(localData);
        // Assuming progress is an array of challenge completions
        for (const item of progress) {
            await supabase.rpc('fn_complete_challenge', {
                p_user_id: userId,
                p_challenge_id: item.challengeId,
                p_xp_earned: item.xp,
                p_results: JSON.stringify({ synced: true, ...item.results })
            });
        }
        // Clear local storage after successful sync
        localStorage.removeItem('py_quest_local_progress');
        console.log('Local progress successfully synced to server.');
    } catch (err) {
        console.error('Failed to sync local progress:', err);
    }
}

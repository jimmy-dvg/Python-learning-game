/**
 * Admin API Service
 * Handles management tasks for challenges and user progress.
 */

import { supabase } from './supabaseClient.js';

/**
 * Fetches all challenges for management.
 */
export async function adminGetChallenges() {
    const { data, error } = await supabase.from('challenges').select('*').order('level_id');
    if (error) throw error;
    return data;
}

/**
 * Creates or updates a challenge.
 */
export async function adminUpsertChallenge(challenge) {
    const { data, error } = await supabase.from('challenges').insert([challenge]);
    if (error) throw error;
    return data;
}

/**
 * Resets user progress for a specific challenge.
 */
export async function adminResetUserProgress(userId, challengeId) {
    const { error } = await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', userId)
        .eq('challenge_id', challengeId);
    if (error) throw error;
}

/**
 * Fetches all user profiles and their total XP.
 */
export async function adminGetUsers() {
    const { data, error } = await supabase.from('profiles').select('id, display_name, xp').order('xp', { ascending: false });
    if (error) throw error;
    return data;
}

/* 
  SUPABASE RLS POLICIES FOR ADMIN:
  
  -- Only admins can INSERT/UPDATE/DELETE challenges
  CREATE POLICY "Admins can manage challenges" 
  ON public.challenges
  FOR ALL
  TO authenticated
  USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' )
  WITH CHECK ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );

  -- Admins can view all submissions (optional)
  CREATE POLICY "Admins can view all submissions"
  ON public.submissions
  FOR SELECT
  TO authenticated
  USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
*/

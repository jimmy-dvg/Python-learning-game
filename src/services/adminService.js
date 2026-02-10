/**
 * Admin API Service
 * Handles management tasks for challenges and user progress.
 */

import { supabase, isSupabaseConfigured } from './supabaseClient.js';

function checkSupabase() {
    if (!isSupabaseConfigured) throw new Error('Supabase not initialized');
}

/**
 * Fetches all challenges for management.
 */
export async function adminGetChallenges() {
    checkSupabase();
    const { data, error } = await supabase.from('challenges').select('*').order('level_id');
    if (error) throw error;
    return data;
}

/**
 * Creates or updates a challenge.
 */
export async function adminUpsertChallenge(challenge) {
    checkSupabase();
    const { data, error } = await supabase.from('challenges').upsert([challenge]);
    if (error) throw error;
    return data;
}

/**
 * Deletes a challenge.
 */
export async function adminDeleteChallenge(challengeId) {
    checkSupabase();
    const { error } = await supabase.from('challenges').delete().eq('id', challengeId);
    if (error) throw error;
}

/**
 * Updates a user's role.
 */
export async function adminUpdateUserRole(userId, role) {
    checkSupabase();
    const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);
    if (error) throw error;
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
    checkSupabase();
    const { data, error } = await supabase.from('profiles').select('id, display_name, xp, role').order('xp', { ascending: false });
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

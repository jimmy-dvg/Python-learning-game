/**
 * Supabase Auth Service
 * Handles user registration, login, logout, and session management.
 */

import { supabase, isSupabaseConfigured } from './supabaseClient.js';

/**
 * Helper to ensure Supabase is initialized.
 */
function checkSupabase() {
    if (!isSupabaseConfigured) {
        throw new Error('Supabase is not initialized. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
    }
}

/**
 * Registers a new user. The profile is created automatically by a DB trigger.
 */
export async function register(email, password, displayName) {
    checkSupabase();
    // We pass displayName in options.data so the DB trigger can find it
    const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
            data: {
                display_name: displayName
            }
        }
    });
    if (error) throw error;

    return data;
}

/**
 * Log in an existing user.
 */
export async function login(email, password) {
    checkSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
}

/**
 * Log out the current user.
 */
export async function logout() {
    checkSupabase();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

/**
 * Get the current authenticated user session.
 */
export async function getCurrentUser() {
    if (!isSupabaseConfigured) return null;
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

/**
 * Assigns a role to a user (Admin only operation in production).
 * RLS Note: Ensure the 'profiles' table has a 'role' column.
 */
export async function assignRole(userId, role) {
    checkSupabase();
    const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);
    if (error) throw error;
}

/* 
  SUPABASE RLS POLICIES NOTES:
  1. Profiles: 
     - "Users can view their own profile": (auth.uid() = id)
     - "Users can update their own profile": (auth.uid() = id)
  2. Role Protection:
     - Create a custom function in Postgres `check_is_admin()`
     - Add policy to sensitive tables: "Admins can do everything": check_is_admin()
*/

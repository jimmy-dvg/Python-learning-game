/**
 * Supabase Auth Service
 * Handles user registration, login, logout, and session management.
 */

// Note: Ensure @supabase/supabase-js is installed via npm
// import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Mocking supabase client for initial setup
// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabase = {
    auth: {
        signUp: async () => ({ data: { user: { id: 'mock' } }, error: null }),
        signInWithPassword: async () => ({ data: { user: { id: 'mock' } }, error: null }),
        signOut: async () => ({ error: null }),
        getUser: async () => ({ data: { user: { id: 'mock', email: 'user@example.com' } } })
    },
    from: () => ({
        insert: async () => ({ error: null }),
        update: async () => ({ error: null }),
        select: () => ({ single: async () => ({ data: { role: 'player' } }) })
    })
};

/**
 * Registers a new user and creates their profile.
 */
export async function register(email, password, displayName) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    if (data.user) {
        // Create profile entry
        const { error: profileError } = await supabase
            .from('profiles')
            .insert([{ id: data.user.id, display_name: displayName, xp: 0 }]);
        if (profileError) throw profileError;
    }
    return data;
}

/**
 * Log in an existing user.
 */
export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
}

/**
 * Log out the current user.
 */
export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

/**
 * Get the current authenticated user session.
 */
export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

/**
 * Assigns a role to a user (Admin only operation in production).
 * RLS Note: Ensure the 'profiles' table has a 'role' column.
 */
export async function assignRole(userId, role) {
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

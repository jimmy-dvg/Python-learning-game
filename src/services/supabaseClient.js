// Copilot: Initialize the Supabase client using Vite environment variables.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = 'Supabase credentials missing. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env';
  console.error(errorMsg);
}

// Create a proxy to provide a better error message if supabase is accessed without being initialized
const client = (supabaseUrl && supabaseAnonKey) 
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = !!client;

export const supabase = new Proxy({}, {
    get: (target, prop) => {
        if (!client) {
            throw new Error(`Supabase client error: Cannot access ".${prop}" because the client is not initialized. Please check your .env file.`);
        }
        return client[prop];
    }
});

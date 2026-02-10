/**
 * Storage Service
 * Handles file uploads to Supabase Storage and profile updates.
 */

import { supabase, isSupabaseConfigured } from './supabaseClient.js';

/**
 * Uploads an avatar image and updates the user's profile.
 */
export async function uploadAvatar(userId, file) {
    if (!isSupabaseConfigured) throw new Error('Supabase not initialized');
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // 1. Upload to Supabase Storage bucket 'avatars'
    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

    // 3. Update profile record
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

    if (updateError) throw updateError;

    return publicUrl;
}

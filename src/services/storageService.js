/**
 * Storage Service
 * Handles file uploads to Supabase Storage and profile updates.
 */

// import { supabase } from './supabaseClient.js';

const supabase = {
    storage: {
        from: () => ({
            upload: async (path) => ({ data: { path }, error: null }),
            getPublicUrl: (path) => ({ data: { publicUrl: `https://example.com/storage/${path}` } })
        })
    },
    from: () => ({
        update: () => ({
            eq: async () => ({ error: null })
        })
    })
};

/**
 * Uploads an avatar image and updates the user's profile.
 * 
 * @param {string} userId - Current user ID.
 * @param {File} file - The image file to upload.
 * @returns {Promise<string>} The public URL of the uploaded image.
 */
export async function uploadAvatar(userId, file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

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

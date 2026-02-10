# Migration: 005_storage_buckets.sql
-- Description: Sets up the storage buckets and their security policies.

-- Note: This is usually done in the dashboard, but can be scripted via SQL
-- in some Supabase environments.

-- 1. Create the 'avatars' bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies for 'avatars'

-- Allow public access to read avatars
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- Allow authenticated users to upload their own avatar
-- The path naming convention used in storageService.js is `${userId}-${Math.random()}.${fileExt}`
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

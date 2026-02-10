-- Add admin flag to profiles table
ALTER TABLE public.profiles 
ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

-- Ensure only existing admins (or the system) can see or modify this column via API
-- For now, we will allow read access to the field
-- Migration: 002_add_roles.sql
-- Description: Adds RBAC (Role Based Access Control) support to profiles.

-- Add role column to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'player';

-- Create an enum for allowed roles if preferred, but TEXT is easier for rapid prototyping.
-- Possible values: 'player', 'moderator', 'admin'

-- Example of an admin check function for RLS
/*
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin' 
    FROM public.profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
*/

-- ROLLBACK
-- ALTER TABLE public.profiles DROP COLUMN role;

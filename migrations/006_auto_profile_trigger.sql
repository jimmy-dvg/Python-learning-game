-- Migration: 006_auto_profile_trigger.sql
-- Description: Automatically create a profile when a new user signs up.
-- This is more reliable than client-side insertion.

-- 1. Create the function that will handle the insertion
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, xp)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)), 
    0
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

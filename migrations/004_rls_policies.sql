# Migration: 004_rls_policies.sql
-- Description: Row Level Security policies for data protection.

-- PROFILES Policies
-- Everyone can see (for leaderboards), but only the owner can update.
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING ( true );

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING ( auth.uid() = id )
WITH CHECK ( auth.uid() = id );

-- LEVELS Policies
-- Everyone can read levels.
CREATE POLICY "Levels are viewable by everyone" 
ON public.levels FOR SELECT 
USING ( true );

-- CHALLENGES Policies
-- Everyone can read challenges.
CREATE POLICY "Challenges are viewable by everyone" 
ON public.challenges FOR SELECT 
USING ( true );

-- USER_PROGRESS Policies
-- Users can only view their own progress.
CREATE POLICY "Users can view own progress" 
ON public.user_progress FOR SELECT 
USING ( auth.uid() = user_id );

-- SUBMISSIONS Policies
-- Users can only view their own submissions.
CREATE POLICY "Users can view own submissions" 
ON public.submissions FOR SELECT 
USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert own submissions" 
ON public.submissions FOR INSERT 
WITH CHECK ( auth.uid() = user_id );

-- Migration: 001_create_schema.sql
-- Description: Initial schema for py-quest learning game.

-- 1. PROFILES
-- Extends the Supabase auth.users with game-specific data.
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  xp INTEGER DEFAULT 0 CHECK (xp >= 0),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. LEVELS
-- Defines the curriculum modules.
CREATE TABLE IF NOT EXISTS public.levels (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  xp_reward INTEGER DEFAULT 100,
  prerequisites TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0
);

-- 3. CHALLENGES
-- Individual tasks within levels.
CREATE TABLE IF NOT EXISTS public.challenges (
  id TEXT PRIMARY KEY,
  level_id TEXT REFERENCES public.levels(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'codeExercise', 'multipleChoice', etc.
  prompt TEXT NOT NULL,
  starter_code TEXT,
  test_schema JSONB DEFAULT '[]'::jsonb, -- Array of {name, check}
  hints TEXT[] DEFAULT '{}',
  xp_reward INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. USER_PROGRESS
-- Tracks completion of challenges.
CREATE TABLE IF NOT EXISTS public.user_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  challenge_id TEXT REFERENCES public.challenges(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  attempts INTEGER DEFAULT 1,
  UNIQUE(user_id, challenge_id)
);

-- 5. SUBMISSIONS
-- Historical record of all attempts.
CREATE TABLE IF NOT EXISTS public.submissions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  challenge_id TEXT REFERENCES public.challenges(id) ON DELETE CASCADE,
  code_submitted TEXT,
  passed BOOLEAN DEFAULT FALSE,
  results JSONB, -- Stores full test output
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- INDEXES
CREATE INDEX idx_profiles_xp ON public.profiles(xp DESC);
CREATE INDEX idx_challenges_level ON public.challenges(level_id);
CREATE INDEX idx_progress_user ON public.user_progress(user_id);
CREATE INDEX idx_submissions_user_challenge ON public.submissions(user_id, challenge_id);

-- ENABLE RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- EXAMPLE INSERTS
INSERT INTO public.levels (id, title, xp_reward, sort_order) VALUES
('variables', 'Variables & Types', 100, 1),
('conditionals', 'Conditionals', 150, 2);

INSERT INTO public.challenges (id, level_id, type, prompt, starter_code, test_schema, xp_reward) VALUES
('var-1', 'variables', 'codeExercise', 'Set answer to 42', 'answer = 0', '[{"name": "Value Check", "check": "assert answer == 42"}]'::jsonb, 20);

-- ROLLBACK SCRIPT (Keep at bottom for reference)
/*
DROP TABLE IF EXISTS public.submissions;
DROP TABLE IF EXISTS public.user_progress;
DROP TABLE IF EXISTS public.challenges;
DROP TABLE IF EXISTS public.levels;
DROP TABLE IF EXISTS public.profiles;
*/

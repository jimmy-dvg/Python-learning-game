-- Migration: 003_atomic_xp_update.sql
-- Description: Create an RPC function to atomically record challenge completion and update player XP.

CREATE OR REPLACE FUNCTION public.fn_complete_challenge(
    p_user_id UUID,
    p_challenge_id TEXT,
    p_xp_earned INTEGER,
    p_results JSONB
)
RETURNS TABLE (
    new_xp INTEGER,
    total_completed BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with elevated privileges to update XP
AS $$
BEGIN
    -- 1. Insert/Update user progress
    INSERT INTO public.user_progress (user_id, challenge_id, attempts)
    VALUES (p_user_id, p_challenge_id, 1)
    ON CONFLICT (user_id, challenge_id) 
    DO UPDATE SET 
        attempts = public.user_progress.attempts + 1,
        completed_at = now();

    -- 2. Update player total XP
    UPDATE public.profiles
    SET xp = xp + p_xp_earned,
        updated_at = now()
    WHERE id = p_user_id;

    -- 3. Return the new stats
    RETURN QUERY
    SELECT 
        xp as new_xp,
        (SELECT count(*) FROM public.user_progress WHERE user_id = p_user_id) as total_completed
    FROM public.profiles
    WHERE id = p_user_id;

END;
$$;

-- ROLLBACK
-- DROP FUNCTION IF EXISTS public.fn_complete_challenge;

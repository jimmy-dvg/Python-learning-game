/**
 * Hint Service
 * Manages hint retrieval and purchase logic.
 */

import { getLevels, getChallengesForLevel } from './gameSchema.js';

// In-memory state for mock persistence
// TODO: Replace with Supabase storage
const userStates = {
    'mock-user-1': { xp: 100, purchasedHints: {} }
};

/**
 * Returns all hints for a given challenge.
 * @param {string} challengeId 
 * @returns {string[]}
 */
export function getHints(challengeId) {
    // We search across all levels for the challenge
    const allChallenges = getLevels().flatMap(level => getChallengesForLevel(level.id));
    const challenge = allChallenges.find(c => c.id === challengeId);
    return challenge ? challenge.hints : [];
}

/**
 * Checks if a user can afford a hint.
 * @param {string} userId 
 * @param {number} cost 
 * @returns {boolean}
 */
export function canAffordHint(userId, cost) {
    const user = userStates[userId];
    return user && user.xp >= cost;
}

/**
 * Requests the next hint for a challenge.
 * Logic: First hint is free, subsequent hints cost 10 XP.
 * 
 * @param {string} userId 
 * @param {string} challengeId 
 * @returns {Object} { hint: string, cost: number, remainingXp: number } or { error: string }
 */
export function requestHint(userId, challengeId) {
    const user = userStates[userId];
    if (!user) return { error: 'User not found' };

    const hints = getHints(challengeId);
    if (!hints.length) return { error: 'No hints available for this challenge' };

    // Track purchased hints for this challenge
    if (!user.purchasedHints[challengeId]) {
        user.purchasedHints[challengeId] = 0;
    }

    const nextHintIndex = user.purchasedHints[challengeId];
    if (nextHintIndex >= hints.length) {
        return { error: 'All hints already revealed' };
    }

    // Cost model: first hint (index 0) is free, others cost 10 XP
    const cost = nextHintIndex === 0 ? 0 : 10;

    if (!canAffordHint(userId, cost)) {
        return { error: 'Insufficient XP for hint' };
    }

    // Deduct XP and record purchase
    // TODO: Implement Supabase RPC to deduct XP and log transaction
    user.xp -= cost;
    user.purchasedHints[challengeId]++;

    return {
        hint: hints[nextHintIndex],
        cost,
        remainingXp: user.xp,
        hintIndex: nextHintIndex
    };
}

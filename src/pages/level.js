// Copilot: Logic for the level page
import { renderHeader } from '../components/header.js';
import { renderChallenge } from '../components/challengePlayer.js';
import { getChallengesForLevel } from '../services/gameSchema.js';

document.addEventListener('DOMContentLoaded', async () => {
    renderHeader();
    
    const container = document.getElementById('challenge-player-container');
    const challenges = getChallengesForLevel('variables');
    const userContext = { id: 'mock-user-1', xp: 100 };

    if (challenges.length > 0) {
        renderChallenge(container, challenges[0], userContext);
    }
});

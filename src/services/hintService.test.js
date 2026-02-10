import { requestHint, canAffordHint, getHints } from './hintService.js';

function runTests() {
    console.log('--- Running Hint Service Tests ---');
    let passed = 0;
    let failed = 0;

    const assert = (condition, msg) => {
        if (condition) { passed++; console.log(`✅ [PASS] ${msg}`); }
        else { failed++; console.error(`❌ [FAIL] ${msg}`); }
    };

    const userId = 'mock-user-1';
    const challengeId = 'var-1'; // From gameSchema.js

    // Test 1: Get Hints
    const hints = getHints(challengeId);
    assert(hints.length > 0, 'Should retrieve hints from schema');

    // Test 2: First hint free
    const res1 = requestHint(userId, challengeId);
    assert(res1.cost === 0, 'First hint should be free');
    assert(res1.hintIndex === 0, 'Should be index 0');

    // Test 3: Second hint costs 10 XP
    const res2 = requestHint(userId, challengeId);
    // Note: Since we only defined 1 hint for 'var-1' in gameSchema.js, this might error
    // Let's check error handling or check a challenge with more hints
    if (hints.length > 1) {
        assert(res2.cost === 10, 'Second hint should cost 10 XP');
    } else {
        assert(res2.error === 'All hints already revealed', 'Should handle end of hints');
    }

    // Test 4: Can afford logic
    assert(canAffordHint(userId, 50) === true, 'User with 100 XP can afford 50 XP');
    assert(canAffordHint(userId, 500) === false, 'User cannot afford 500 XP');

    console.log(`\n--- Results: ${passed} passed, ${failed} failed ---`);
    if (failed > 0) process.exit(1);
}

runTests();

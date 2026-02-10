import { recordProgress } from './progressService.js';

async function runTests() {
    console.log('--- Running Progress Service Tests ---');
    let passed = 0;
    let failed = 0;

    const assert = (condition, msg) => {
        if (condition) { passed++; console.log(`✅ [PASS] ${msg}`); }
        else { failed++; console.error(`❌ [FAIL] ${msg}`); }
    };

    const mockResult = {
        success: true,
        code: 'print("hello")',
        tests: [{ name: 'Test 1', passed: true }]
    };

    // Test 1: Successful progress recording
    try {
        const stats = await recordProgress({
            userId: 'user-123',
            challengeId: 'var-1',
            result: mockResult,
            xpEarned: 20
        });
        assert(stats.new_xp === 120, 'Should return updated XP from RPC');
        assert(stats.total_completed === 5, 'Should return total completed challenges');
    } catch (e) {
        assert(false, `Should not throw on valid input: ${e.message}`);
    }

    // Test 2: Missing fields validation
    try {
        await recordProgress({ userId: 'user-123' });
        assert(false, 'Should throw error for missing challengeId');
    } catch (e) {
        assert(true, 'Correctly threw error for missing challengeId');
    }

    console.log(`\n--- Results: ${passed} passed, ${failed} failed ---`);
    if (failed > 0) process.exit(1);
}

runTests();

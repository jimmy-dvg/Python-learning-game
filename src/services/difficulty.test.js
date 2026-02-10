import { scaleDifficulty, generateVariant } from './difficulty.js';

function runTests() {
    console.log('--- Running Difficulty & Variant Tests ---');
    let passed = 0;
    let failed = 0;

    const assert = (condition, msg) => {
        if (condition) { passed++; console.log(`✅ [PASS] ${msg}`); }
        else { failed++; console.error(`❌ [FAIL] ${msg}`); }
    };

    // Test 1: Scaling Logic
    const level0 = scaleDifficulty(0);
    const level5 = scaleDifficulty(5);
    assert(level5.xpMultiplier > level0.xpMultiplier, 'XP Multiplier should increase with level');
    assert(level5.testCount > level0.testCount, 'Test count should increase with level');
    assert(level5.hintCount < level0.hintCount, 'Hint count should decrease with level');

    // Test 2: Deterministic Variants
    const template = {
        id: 'test-challenge',
        prompt: 'Set {{var}} to {{val}}',
        starterCode: '{{var}} = 0',
        tests: [{ check: 'assert {{var}} == {{val}}' }]
    };

    const v1 = generateVariant(template, 1);
    const v2 = generateVariant(template, 2);
    const v1_again = generateVariant(template, 1);

    assert(v1.starterCode !== v2.starterCode, 'Different seeds should produce different code');
    assert(v1.starterCode === v1_again.starterCode, 'Same seed should produce identical code');
    assert(v1.starterCode.includes('beta') || v1.starterCode.includes('alpha'), 'Should contain substituted variable');
    assert(!v1.starterCode.includes('{{var}}'), 'Placeholder should be removed');

    console.log(`\n--- Results: ${passed} passed, ${failed} failed ---`);
    if (failed > 0) process.exit(1);
}

runTests();

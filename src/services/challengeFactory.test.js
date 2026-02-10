import { createChallenge, ChallengeTypes, examples } from './challengeFactory.js';

/**
 * Simple Test Harness for Challenge Factory
 */
function runTests() {
  console.log('--- Running Challenge Factory Tests ---');
  let passedCount = 0;
  let failedCount = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passedCount++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      failedCount++;
    }
  }

  // Test 1: Validate shape of multipleChoice
  try {
    const mc = createChallenge(examples[0]);
    assert(mc.type === ChallengeTypes.MULTIPLE_CHOICE, 'Should have multipleChoice type');
    assert(Array.isArray(mc.options), 'multipleChoice should have options array');
    assert(mc.xp === 10, 'Should retain xp value');
  } catch (e) {
    assert(false, `Creation failed: ${e.message}`);
  }

  // Test 2: Validate shape of codeExercise
  try {
    const ce = createChallenge(examples[2]);
    assert(ce.type === ChallengeTypes.CODE_EXERCISE, 'Should have codeExercise type');
    assert(ce.starterCode.includes('age = 20'), 'Should contain starter code');
    assert(ce.tests.length > 0, 'codeExercise should have tests');
  } catch (e) {
    assert(false, `Creation failed: ${e.message}`);
  }

  // Test 3: Validation Error for missing fields
  try {
    createChallenge({ id: 'bad' });
    assert(false, 'Should have thrown error for missing fields');
  } catch (e) {
    assert(true, 'Correctly threw error for missing required fields');
  }

  console.log(`\n--- Results: ${passedCount} passed, ${failedCount} failed ---`);
  
  if (failedCount > 0) {
    process.exit(1);
  }
}

// Run if this script is executed directly (Node.js)
if (typeof process !== 'undefined' && process.argv) {
    runTests();
}

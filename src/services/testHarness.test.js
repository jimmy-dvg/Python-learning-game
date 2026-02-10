import { generateTestWrapper, parseRunnerOutput } from './testHarness.js';

function runTests() {
    console.log('--- Running Test Harness Logic Tests ---');
    let passed = 0;
    let failed = 0;

    const assert = (condition, msg) => {
        if (condition) { passed++; console.log(`✅ [PASS] ${msg}`); }
        else { failed++; console.error(`❌ [FAIL] ${msg}`); }
    };

    const userCode = "def solution(a, b):\n    return a + b";
    const tests = [
        { name: "Basic", input: [1, 2], expected: 3 },
        { name: "Zero", input: [0, 0], expected: 0 }
    ];

    // Test 1: Wrapper Generation
    const script = generateTestWrapper(userCode, tests);
    assert(script.includes('import json'), 'Script should include json module');
    assert(script.includes('solution(1, 2)'), 'Script should include call to solution with inputs');
    assert(script.includes('print(json.dumps(results))'), 'Script should print results at the end');

    // Test 2: Output Parsing (Success)
    const mockStdout = 'Some debug output here\n[{"name": "Basic", "passed": true, "output": "3", "expected": "3"}, {"name": "Zero", "passed": true, "output": "0", "expected": "0"}]';
    const result = parseRunnerOutput(mockStdout, tests);
    assert(result.success === true, 'Should mark overall success as true');
    assert(result.tests.length === 2, 'Should have 2 test results');
    assert(result.feedback.includes('Perfect'), 'Should give positive feedback');

    // Test 3: Output Parsing (Partial Failure)
    const mockStdoutFail = '[{"name": "Basic", "passed": true, "output": "3", "expected": "3"}, {"name": "Zero", "passed": false, "output": "1", "expected": "0"}]';
    const resultFail = parseRunnerOutput(mockStdoutFail, tests);
    assert(resultFail.success === false, 'Should mark overall success as false');
    assert(resultFail.feedback.includes('Passed 1/2'), 'Should report partial success');

    console.log(`\n--- Results: ${passed} passed, ${failed} failed ---`);
    if (failed > 0) process.exit(1);
}

runTests();

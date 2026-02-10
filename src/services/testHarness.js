/**
 * Test Harness Service
 * Prepares user code for execution and evaluates test results.
 */

/**
 * Wraps user code with test execution logic for the Python runner.
 * 
 * @param {string} userCode - The code submitted by the user.
 * @param {Array} tests - Array of test objects {name, input, expected}.
 * @param {string} functionName - Optional name of the function to call.
 * @returns {string} The full Python script to be executed.
 */
export function generateTestWrapper(userCode, tests, functionName = 'solution') {
    let script = `${userCode}\n\n`;
    script += `import json\n\n`;
    script += `results = []\n`;
    
    tests.forEach((test, index) => {
        const inputs = Array.isArray(test.input) ? test.input.join(', ') : JSON.stringify(test.input);
        script += `
try:
    # Test ${index}: ${test.name}
    res = ${functionName}(${inputs})
    results.append({
        "name": "${test.name}",
        "passed": res == ${JSON.stringify(test.expected)},
        "output": str(res),
        "expected": "${test.expected}"
    })
except Exception as e:
    results.append({
        "name": "${test.name}",
        "passed": False,
        "output": str(e),
        "expected": "${test.expected}"
    })
`;
    });

    script += `\nprint(json.dumps(results))`;
    return script;
}

/**
 * Parses the stdout from the Python runner into structured results.
 * 
 * @param {string} stdout - The string output from the execution.
 * @param {Array} originalTests - The original test schema for reference.
 * @returns {Object} { success, tests, feedback }
 */
export function parseRunnerOutput(stdout, originalTests) {
    try {
        // Find the last line which should be our JSON results
        const lines = stdout.trim().split('\n');
        const jsonStr = lines[lines.length - 1];
        const results = JSON.parse(jsonStr);

        const successCount = results.filter(r => r.passed).length;
        
        return {
            success: successCount === originalTests.length,
            tests: results,
            feedback: successCount === originalTests.length 
                ? "Perfect! All tests passed." 
                : `Passed ${successCount}/${originalTests.length} tests.`
        };
    } catch (err) {
        return {
            success: false,
            tests: originalTests.map(t => ({ name: t.name, passed: false, output: 'Runtime Error or invalid output format' })),
            feedback: "The runner encountered an error parsing the output: " + err.message
        };
    }
}

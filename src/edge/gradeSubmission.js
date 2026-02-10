/**
 * Supabase Edge Function: grade-submission
 * 
 * Securely evaluates Python submissions against stored test cases.
 * 
 * Security Note:
 * NEVER use eval() or child_process.exec() directly on user code in a shared environment.
 * Production approaches:
 * 1. Piston (https://github.com/engineer-man/piston) - Third-party API for secure code execution.
 * 2. AWS Lambda / Google Cloud Functions - Individual ephemeral containers.
 * 3. Custom Firecracker/Wasm sandbox.
 */

// import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export default async function handler(req) {
    const { challengeId, submissionCode, userId } = await req.json();

    // 1. Fetch Challenge & Tests from DB
    // In a real Edge Function, you would use service_role key to access the 'challenges' table
    // const { data: challenge } = await supabase.from('challenges').select('*').eq('id', challengeId).single();
    
    // Mock Challenge Data for Local Dev
    const mockChallenge = {
        id: challengeId,
        test_schema: [
            { name: "Syntax Check", check: "validate_syntax" },
            { name: "Logic Pass", check: "check_output" }
        ],
        xp_reward: 20
    };

    try {
        // 2. Secure Sandbox Execution
        // TODO: Forward 'submissionCode' and 'mockChallenge.test_schema' to a secure runner (e.g., Piston API)
        const evaluationResult = await mockSandboxRunner(submissionCode, mockChallenge.test_schema);

        // 3. Compute XP
        const xpEarned = evaluationResult.success ? mockChallenge.xp_reward : 0;

        // 4. Persistence
        // TODO: call public.fn_complete_challenge RPC if success == true
        // TODO: insert into public.submissions for audit

        return new Response(
            JSON.stringify({
                success: evaluationResult.success,
                tests: evaluationResult.tests,
                xpEarned: xpEarned,
                feedback: evaluationResult.success ? "Great job!" : "Try analyzing the error message."
            }),
            { headers: { "Content-Type": "application/json" } }
        );

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

/**
 * Simulates a secure Python sandbox for local development.
 */
async function mockSandboxRunner(code, tests) {
    // Artificial delay to simulate remote execution
    await new Promise(r => setTimeout(r, 1200));

    // Simple heuristic: If code contains "print", "def", or "=" and is over 5 chars, it "passes" syntax
    const hasCode = code.trim().length > 5;
    
    return {
        success: hasCode,
        tests: tests.map(t => ({
            name: t.name,
            passed: hasCode,
            output: hasCode ? "Execution successful" : "Empty code or syntax error",
            expected: "Valid Python logic"
        }))
    };
}

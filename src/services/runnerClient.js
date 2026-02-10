/**
 * Runner Client Service
 * Communicates with the remote Python grading Edge Function.
 */

const API_ENDPOINT = '/api/grade'; // This will be handled by Vite proxy or Supabase Edge function path
const MAX_RETRIES = 3;
const INITIAL_BACKOFF = 1000; // 1 second

/**
 * Submits user code for grading.
 * 
 * @param {Object} params - {userId, challengeId, code}
 * @returns {Promise<Object>} The grading results {success, tests: [...], xpEarned, feedback}
 */
export async function runSubmission({ userId, challengeId, code }) {
    let attempt = 0;

    const execute = async () => {
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // TODO: Add Supabase Auth header once integrated
                    // 'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ userId, challengeId, code })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Server error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            if (attempt < MAX_RETRIES) {
                attempt++;
                const delay = INITIAL_BACKOFF * Math.pow(2, attempt - 1);
                console.warn(`Submission failed (attempt ${attempt}). Retrying in ${delay}ms...`, error);
                await new Promise(resolve => setTimeout(resolve, delay));
                return execute();
            }
            throw error;
        }
    };

    return execute();
}

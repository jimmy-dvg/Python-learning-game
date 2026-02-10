/**
 * Difficulty Scaling and Challenge Variation Service
 */

/**
 * Scales difficulty parameters based on the level index using a gentle exponential curve.
 * 
 * @param {number} levelIndex - The 0-based index of the player's current level.
 * @returns {Object} Scaling parameters.
 */
export function scaleDifficulty(levelIndex) {
    const baseTestCount = 2;
    const baseHintCount = 3;
    const baseTimeLimit = 60; // seconds

    return {
        testCount: Math.round(baseTestCount * Math.pow(1.2, levelIndex)),
        hintCount: Math.max(1, Math.round(baseHintCount * Math.pow(0.8, levelIndex))),
        timeLimitSeconds: Math.round(baseTimeLimit * Math.pow(1.15, levelIndex)),
        xpMultiplier: parseFloat((1 + (levelIndex * 0.1)).toFixed(2))
    };
}

/**
 * Generates a deterministic variant of a challenge template based on a seed.
 * Substitutes placeholders like {{var}} and {{val}} in starterCode and tests.
 * 
 * @param {Object} template - The challenge template object.
 * @param {number} seed - A numeric seed for deterministic generation.
 * @returns {Object} The challenge variant.
 */
export function generateVariant(template, seed) {
    const varNames = ['alpha', 'beta', 'gamma', 'delta', 'omega', 'zeta'];
    const varName = varNames[seed % varNames.length];
    const numericValue = (seed * 7) % 100 + 1;

    const substitute = (text) => {
        if (!text) return text;
        return text
            .replace(/\{\{var\}\}/g, varName)
            .replace(/\{\{val\}\}/g, numericValue.toString());
    };

    return {
        ...template,
        prompt: substitute(template.prompt),
        starterCode: substitute(template.starterCode),
        tests: template.tests.map(t => ({
            ...t,
            check: substitute(t.check)
        })),
        id: `${template.id}-v${seed}`
    };
}

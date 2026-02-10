/**
 * Challenge Types Constants
 */
export const ChallengeTypes = {
  MULTIPLE_CHOICE: 'multipleChoice',
  FILL_IN_THE_BLANK: 'fillInTheBlank',
  CODE_EXERCISE: 'codeExercise',
  DEBUGGING_TASK: 'debuggingTask'
};

/**
 * Factory function to create challenge objects with a consistent shape.
 * 
 * @param {Object} template - The template data for the challenge.
 * @returns {Object} A validated challenge object.
 */
export function createChallenge(template) {
  const {
    id,
    levelId,
    type,
    prompt,
    starterCode = '',
    tests = [],
    hints = [],
    xp = 0,
    options = [], // For multipleChoice
    answer = ''   // For fillInTheBlank or single answer
  } = template;

  // Simple validation for required fields
  if (!id || !levelId || !type || !prompt) {
    throw new Error(`Challenge template missing required fields: id, levelId, type, or prompt. Provided: ${JSON.stringify(template)}`);
  }

  if (!Object.values(ChallengeTypes).includes(type)) {
    throw new Error(`Invalid challenge type: ${type}`);
  }

  return {
    id,
    levelId,
    type,
    prompt,
    starterCode,
    tests,
    hints,
    xp,
    options,
    answer
  };
}

/**
 * Examples for each type
 */
export const examples = [
  {
    id: 'ex-mc-1',
    levelId: 'variables',
    type: ChallengeTypes.MULTIPLE_CHOICE,
    prompt: 'Which of the following is a valid Python variable name?',
    options: ['2nd_var', 'my-var', 'my_var', 'import'],
    answer: 'my_var',
    xp: 10
  },
  {
    id: 'ex-fb-1',
    levelId: 'variables',
    type: ChallengeTypes.FILL_IN_THE_BLANK,
    prompt: 'In Python, the ______ function is used to output text to the console.',
    answer: 'print',
    xp: 15
  },
  {
    id: 'ex-ce-1',
    levelId: 'conditionals',
    type: ChallengeTypes.CODE_EXERCISE,
    prompt: 'Fix the if statement to check if age is 18 or older.',
    starterCode: 'age = 20\nif age > 18:\n    print("Adult")',
    tests: [{ name: 'Adult Case', check: 'assert age >= 18' }],
    xp: 25
  },
  {
    id: 'ex-dt-1',
    levelId: 'loops',
    type: ChallengeTypes.DEBUGGING_TASK,
    prompt: 'This loop is intended to print 0 to 4 but it has an error. Fix it.',
    starterCode: 'for i in range[5]:\n    print(i)',
    tests: [{ name: 'Correct Syntax', check: 'for i in range(5):' }],
    xp: 30
  }
];

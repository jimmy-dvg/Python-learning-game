/**
 * Game Content Schema
 * Defines the progression levels and specific coding challenges.
 */

const gameData = {
  /**
   * Progression levels for the Python course.
   */
  levels: [
    {
      id: "variables",
      title: "Variables and Data Types",
      topics: ["Strings", "Integers", "Floats", "Booleans"],
      xpReward: 100,
      prerequisites: []
    },
    {
      id: "conditionals",
      title: "Conditionals",
      topics: ["If", "Elif", "Else", "Comparisons"],
      xpReward: 150,
      prerequisites: ["variables"]
    },
    {
      id: "loops",
      title: "Loops",
      topics: ["For loops", "While loops", "Iterating"],
      xpReward: 200,
      prerequisites: ["conditionals"]
    },
    {
      id: "functions",
      title: "Functions",
      topics: ["Parameters", "Return values", "Scope"],
      xpReward: 300,
      prerequisites: ["loops"]
    },
    {
      id: "objects",
      title: "Classes and Objects",
      topics: ["Attributes", "Methods", "Inheritance"],
      xpReward: 500,
      prerequisites: ["functions"]
    }
  ],

  /**
   * Challenges within each level.
   */
  challenges: [
    {
      id: "var-1",
      levelId: "variables",
      type: "code",
      prompt: "Assign the integer 42 to a variable named 'answer'.",
      starterCode: "# Your code here\n",
      tests: [
        { name: "Exists", check: "assert 'answer' in locals()" },
        { name: "Value", check: "assert answer == 42" }
      ],
      hints: ["Variable names go on the left of the = sign."],
      xp: 20
    },
    {
      id: "cond-1",
      levelId: "conditionals",
      type: "code",
      prompt: "Create an if-statement that checks if 'score' is greater than 50. If true, set 'passed' to True.",
      starterCode: "score = 75\n# Your code here\n",
      tests: [
        { name: "Result", check: "assert passed == True" }
      ],
      hints: ["Don't forget the colon (:) at the end of the if statement."],
      xp: 30
    },
    {
      id: "loop-1",
      levelId: "loops",
      type: "code",
      prompt: "Use a for loop to calculate the sum of numbers 1 to 5.",
      starterCode: "total = 0\n# Your code here\n",
      tests: [
        { name: "Summation", check: "assert total == 15" }
      ],
      hints: ["Use the range(1, 6) function to get numbers 1 to 5."],
      xp: 40
    },
    {
      id: "func-1",
      levelId: "functions",
      type: "code",
      prompt: "Define a function 'greet' that takes a 'name' and returns 'Hello, <name>'.",
      starterCode: "def greet(name):\n    # Your code here\n",
      tests: [
        { name: "Output", check: "assert greet('World') == 'Hello, World'" }
      ],
      hints: ["Use f-strings or concatenation."],
      xp: 50
    },
    {
      id: "obj-1",
      levelId: "objects",
      type: "code",
      prompt: "Create a class 'Pet' with an '__init__' method that sets 'self.name'.",
      starterCode: "class Pet:\n    # Your code here\n",
      tests: [
        { name: "Instance", check: "assert Pet('Fluffy').name == 'Fluffy'" }
      ],
      hints: ["The first parameter of any class method should be 'self'."],
      xp: 100
    }
  ]
};

/**
 * Returns all available levels.
 * @returns {Array} Array of level objects.
 */
export function getLevels() {
  return gameData.levels;
}

/**
 * Returns all challenges associated with a specific level ID.
 * @param {string} levelId - The ID of the level.
 * @returns {Array} Array of challenge objects.
 */
export function getChallengesForLevel(levelId) {
  return gameData.challenges.filter(challenge => challenge.levelId === levelId);
}

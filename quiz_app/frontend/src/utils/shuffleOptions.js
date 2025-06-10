/**
 * Shuffles the options of a question while maintaining the correct answer mapping
 * @param {Object} question - The question object with options and correctAnswer
 * @returns {Object} - The question with shuffled options and updated correctAnswer
 */
export function shuffleQuestionOptions(question) {
  // Create an array of option entries [key, value]
  const optionEntries = Object.entries(question.options);
  
  // Store the correct answer value before shuffling
  const correctAnswerValue = question.options[question.correctAnswer];
  
  // Fisher-Yates shuffle algorithm
  for (let i = optionEntries.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [optionEntries[i], optionEntries[j]] = [optionEntries[j], optionEntries[i]];
  }
  
  // Create new options object with original keys (a, b, c, d) but shuffled values
  const shuffledOptions = {};
  const optionKeys = ['a', 'b', 'c', 'd'];
  let newCorrectAnswer = '';
  
  optionEntries.forEach((entry, index) => {
    const key = optionKeys[index];
    shuffledOptions[key] = entry[1];
    
    // Find where the correct answer ended up
    if (entry[1] === correctAnswerValue) {
      newCorrectAnswer = key;
    }
  });
  
  return {
    ...question,
    options: shuffledOptions,
    correctAnswer: newCorrectAnswer,
    _originalCorrectAnswer: question.correctAnswer // Keep original for debugging
  };
}

/**
 * Shuffles options for an array of questions
 * @param {Array} questions - Array of question objects
 * @returns {Array} - Array of questions with shuffled options
 */
export function shuffleAllQuestions(questions) {
  return questions.map(question => shuffleQuestionOptions(question));
}
import React, { useState } from 'react';

function QuizConfig({ selectedTopic, onStartQuiz, onBack }) {
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState('balanced');

  const questionCountOptions = [5, 10, 15, 20, 25, 30];
  const difficultyOptions = [
    { value: 'balanced', label: 'Balanced (Mixed Difficulty)', description: 'Mix of all difficulty levels' },
    { value: 'easy', label: 'Easy', description: 'Basic knowledge questions' },
    { value: 'moderate', label: 'Moderate', description: 'Intermediate level questions' },
    { value: 'challenging', label: 'Challenging', description: 'Advanced knowledge questions' }
  ];

  const handleStartQuiz = () => {
    const config = {
      topic: selectedTopic,
      questionCount,
      difficulty: difficulty === 'balanced' ? null : difficulty // null means all difficulties
    };
    onStartQuiz(config);
  };

  return (
    <div className="quiz-config">
      <button className="secondary back-button" onClick={onBack}>
        Back to Menu
      </button>
      
      <div className="card">
        <h2>Quiz Configuration</h2>
        <p className="topic-info">
          <strong>Topic:</strong> {selectedTopic === 'all' ? 'All Topics' : selectedTopic}
        </p>
        
        <div className="config-section">
          <h3>Number of Questions</h3>
          <div className="question-count-selector">
            <select 
              value={questionCount} 
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              className="config-select"
            >
              {questionCountOptions.map(count => (
                <option key={count} value={count}>
                  {count} Questions
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="config-section">
          <h3>Difficulty Level</h3>
          <div className="difficulty-selector">
            {difficultyOptions.map(option => (
              <div 
                key={option.value} 
                className={`difficulty-option ${difficulty === option.value ? 'selected' : ''}`}
                onClick={() => setDifficulty(option.value)}
              >
                <div className="difficulty-label">
                  <strong>{option.label}</strong>
                </div>
                <div className="difficulty-description">
                  {option.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="config-actions">
          <button 
            className="primary start-quiz-btn"
            onClick={handleStartQuiz}
          >
            Start Quiz ({questionCount} Questions)
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizConfig;
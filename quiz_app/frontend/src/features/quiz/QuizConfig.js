import React, { useState, useEffect, useRef } from 'react';

function QuizConfig({ selectedTopic, onStartQuiz, onBack }) {
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState('balanced');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Debug log for difficulty changes
  useEffect(() => {
    console.log('Current difficulty:', difficulty);
  }, [difficulty]);
  
  // Debug component mount
  useEffect(() => {
    console.log('QuizConfig mounted, initial difficulty:', difficulty);
  }, []);

  const questionCountOptions = [5, 10, 15, 20, 25, 30];
  const difficultyOptions = [
    { value: 'balanced', label: 'Balanced (Mixed Difficulty)', description: 'Mix of all difficulty levels' },
    { value: 'easy', label: 'Easy', description: 'Basic knowledge questions' },
    { value: 'moderate', label: 'Moderate', description: 'Intermediate level questions' },
    { value: 'challenging', label: 'Challenging', description: 'Advanced knowledge questions' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isDropdownOpen]);

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
            <div className="custom-dropdown" ref={dropdownRef}>
              <button
                type="button"
                className={`dropdown-button ${isDropdownOpen ? 'open' : ''}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
              >
                <span>{questionCount} Questions</span>
                <span className="dropdown-arrow">▼</span>
              </button>
              
              {isDropdownOpen && (
                <div className="dropdown-menu" role="listbox">
                  {questionCountOptions.map(count => (
                    <button
                      key={count}
                      type="button"
                      className={`dropdown-option ${count === questionCount ? 'selected' : ''}`}
                      onClick={() => {
                        setQuestionCount(count);
                        setIsDropdownOpen(false);
                      }}
                      role="option"
                      aria-selected={count === questionCount}
                    >
                      {count} Questions
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="config-section">
          <h3>Difficulty Level</h3>
          <div className="difficulty-selector" role="radiogroup" aria-label="Select difficulty level">
            {difficultyOptions.map(option => (
              <button 
                key={option.value} 
                type="button"
                className={`difficulty-option ${difficulty === option.value ? 'selected' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Difficulty clicked:', option.value);
                  console.log('Current difficulty before change:', difficulty);
                  setDifficulty(option.value);
                  console.log('Setting difficulty to:', option.value);
                }}
                onMouseDown={(e) => {
                  console.log('Mouse down on:', option.value);
                }}
                onTouchStart={(e) => {
                  console.log('Touch start on:', option.value);
                }}
                aria-pressed={difficulty === option.value}
                role="radio"
                aria-checked={difficulty === option.value}
              >
                <div className="difficulty-label">
                  <strong>{option.label}</strong>
                </div>
                <div className="difficulty-description">
                  {option.description}
                </div>
              </button>
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
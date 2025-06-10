import React, { useState, useEffect, useRef } from 'react';

function QuizConfig({ selectedTopic, onStartQuiz, onBack }) {
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState('balanced');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDifficultyDropdownOpen, setIsDifficultyDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const difficultyDropdownRef = useRef(null);
  
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
      if (difficultyDropdownRef.current && !difficultyDropdownRef.current.contains(event.target)) {
        setIsDifficultyDropdownOpen(false);
      }
    };

    if (isDropdownOpen || isDifficultyDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isDropdownOpen, isDifficultyDropdownOpen]);

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
          <div className="difficulty-selector">
            <div className="custom-dropdown" ref={difficultyDropdownRef}>
              <button
                type="button"
                className={`dropdown-button ${isDifficultyDropdownOpen ? 'open' : ''}`}
                onClick={() => setIsDifficultyDropdownOpen(!isDifficultyDropdownOpen)}
                aria-haspopup="listbox"
                aria-expanded={isDifficultyDropdownOpen}
              >
                <span>{difficultyOptions.find(opt => opt.value === difficulty)?.label}</span>
                <span className="dropdown-arrow">▼</span>
              </button>
              
              {isDifficultyDropdownOpen && (
                <div className="dropdown-menu" role="listbox">
                  {difficultyOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      className={`dropdown-option ${option.value === difficulty ? 'selected' : ''}`}
                      onClick={() => {
                        setDifficulty(option.value);
                        setIsDifficultyDropdownOpen(false);
                      }}
                      role="option"
                      aria-selected={option.value === difficulty}
                    >
                      <div className="dropdown-option-label">{option.label}</div>
                      <div className="dropdown-option-description">{option.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
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
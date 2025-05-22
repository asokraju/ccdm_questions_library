import React from 'react';

function Question({ question, selectedAnswer, showExplanation, onAnswerSelect }) {
  const getOptionClass = (optionKey) => {
    let classes = ['option'];
    
    if (selectedAnswer === optionKey) {
      classes.push('selected');
    }
    
    if (showExplanation) {
      classes.push('disabled');
      if (optionKey === question.correctAnswer) {
        classes.push('correct');
      } else if (selectedAnswer === optionKey) {
        classes.push('incorrect');
      }
    }
    
    return classes.join(' ');
  };

  return (
    <div className="question-container fade-in">
      <h3>{question.question}</h3>
      <div className="topic-info">
        <small>Topic: {question.topic} | Subtopic: {question.subtopic}</small>
      </div>
      
      <div className="options">
        {Object.entries(question.options).map(([key, value]) => (
          <div
            key={key}
            className={getOptionClass(key)}
            onClick={() => onAnswerSelect(key)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onAnswerSelect(key);
              }
            }}
          >
            <strong>{key.toUpperCase()}.</strong> {value}
          </div>
        ))}
      </div>
      
      {showExplanation && (
        <div className="explanation fade-in">
          <h4>Explanation:</h4>
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  );
}

export default Question;
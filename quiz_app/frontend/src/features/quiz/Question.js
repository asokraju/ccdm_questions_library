import React, { useState, useEffect } from 'react';

const Question = React.memo(function Question({ question, selectedAnswer, showExplanation, onAnswerSelect, comment, onCommentChange }) {
  const [localComment, setLocalComment] = useState(comment || '');

  useEffect(() => {
    setLocalComment(comment || '');
  }, [comment, question.id]);

  const handleCommentChange = (e) => {
    const newComment = e.target.value;
    setLocalComment(newComment);
    if (onCommentChange) {
      onCommentChange(newComment);
    }
  };

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
      
      <div className="comment-section">
        <label htmlFor="comment">Your Notes:</label>
        <textarea
          id="comment"
          className="comment-textarea"
          value={localComment}
          onChange={handleCommentChange}
          placeholder="Add your notes or comments about this question..."
          rows="3"
        />
      </div>
    </div>
  );
});

export default Question;
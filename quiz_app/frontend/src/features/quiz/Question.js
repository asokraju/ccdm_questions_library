import React, { useState, useEffect } from 'react';
import { commentTemplates } from '../../utils/commentTemplates';

const Question = React.memo(function Question({ question, selectedAnswer, showExplanation, onAnswerSelect, comment, onCommentChange }) {
  const [localComment, setLocalComment] = useState(comment || '');
  const [showTemplates, setShowTemplates] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const maxCommentLength = 500;

  useEffect(() => {
    setLocalComment(comment || '');
  }, [comment, question.id]);

  const handleCommentChange = (e) => {
    const newComment = e.target.value;
    if (newComment.length <= maxCommentLength) {
      setLocalComment(newComment);
      if (onCommentChange) {
        onCommentChange(newComment);
        setLastSaved(Date.now());
        setTimeout(() => setLastSaved(null), 2000);
      }
    }
  };

  const handleTemplateSelect = (template) => {
    const newComment = localComment ? localComment + ' ' + template.text : template.text;
    if (newComment.length <= maxCommentLength) {
      setLocalComment(newComment);
      if (onCommentChange) {
        onCommentChange(newComment);
      }
    }
    setShowTemplates(false);
  };

  const handleClearComment = () => {
    setLocalComment('');
    if (onCommentChange) {
      onCommentChange('');
    }
  };

  const handleCopyComment = () => {
    navigator.clipboard.writeText(localComment);
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
        <div className="comment-header">
          <label htmlFor="comment">Your Notes:</label>
          <div className="comment-actions">
            <button 
              className="comment-action-btn"
              onClick={() => setShowTemplates(!showTemplates)}
              title="Use template"
            >
              📝
            </button>
            <button 
              className="comment-action-btn"
              onClick={handleCopyComment}
              disabled={!localComment}
              title="Copy comment"
            >
              📋
            </button>
            <button 
              className="comment-action-btn"
              onClick={handleClearComment}
              disabled={!localComment}
              title="Clear comment"
            >
              🗑️
            </button>
          </div>
        </div>
        
        {showTemplates && (
          <div className="comment-templates">
            {commentTemplates.map(template => (
              <button
                key={template.id}
                className="template-btn"
                onClick={() => handleTemplateSelect(template)}
              >
                {template.label}
              </button>
            ))}
          </div>
        )}
        
        <textarea
          id="comment"
          className="comment-textarea"
          value={localComment}
          onChange={handleCommentChange}
          placeholder="Add your notes or comments about this question..."
          rows="3"
        />
        
        <div className="comment-footer">
          <span className={`char-count ${localComment.length > maxCommentLength * 0.9 ? 'warning' : ''}`}>
            {localComment.length}/{maxCommentLength}
          </span>
          {lastSaved && <span className="save-indicator">✓ Saved</span>}
        </div>
      </div>
    </div>
  );
});

export default Question;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Question from './Question';

function ReviewList({ onBack }) {
  const [reviewQuestions, setReviewQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReviewQuestions();
  }, []);

  const loadReviewQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/reviews');
      setReviewQuestions(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading review questions:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="card">Loading questions...</div>;
  }

  if (selectedQuestion) {
    return (
      <div>
        <button 
          className="secondary back-button" 
          onClick={() => setSelectedQuestion(null)}
        >
          Back to List
        </button>
        
        <div className="question-card card">
          <Question
            question={selectedQuestion}
            selectedAnswer={null}
            showExplanation={true}
            onAnswerSelect={() => {}}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <button className="secondary back-button" onClick={onBack}>
        Back to Menu
      </button>
      
      <div className="card">
        <h2>Review Incorrect Answers</h2>
        
        {reviewQuestions.length === 0 ? (
          <p>No incorrect answers to review. Great job!</p>
        ) : (
          <div className="review-list">
            {reviewQuestions.map((question, index) => (
              <div
                key={question.id}
                className="review-item"
                onClick={() => setSelectedQuestion(question)}
              >
                <h4>Question {index + 1}</h4>
                <p>{question.question.substring(0, 100)}...</p>
                <small>
                  {question.topic} - {question.subtopic} - {question.difficulty}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewList;
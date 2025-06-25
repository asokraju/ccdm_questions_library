import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import apiUserService from '../../services/apiUserService';
import { Question } from '../quiz';

function ReviewList({ onBack }) {
  const [reviewQuestions, setReviewQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState({});

  useEffect(() => {
    loadReviewQuestions();
    // Load saved comments from localStorage
    const savedComments = localStorage.getItem('quizComments');
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, []);

  const loadReviewQuestions = async () => {
    try {
      setIsLoading(true);
      const currentUser = apiUserService.getCurrentUser();
      const reviews = await apiService.getReviews(currentUser);
      setReviewQuestions(reviews);
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
            selectedAnswer={selectedQuestion.userAnswer}
            showExplanation={true}
            onAnswerSelect={() => {}}
            comment={selectedQuestion.userComment || comments[selectedQuestion.id] || ''}
            onCommentChange={(newComment) => {
              const updatedComments = {
                ...comments,
                [selectedQuestion.id]: newComment
              };
              setComments(updatedComments);
              localStorage.setItem('quizComments', JSON.stringify(updatedComments));
            }}
          />
          {selectedQuestion.userAnswer && (
            <div className="user-answer-info">
              <p><strong>Your answer:</strong> {selectedQuestion.userAnswer.toUpperCase()}</p>
              {selectedQuestion.answeredAt && (
                <p><small>Answered on: {new Date(selectedQuestion.answeredAt).toLocaleString()}</small></p>
              )}
            </div>
          )}
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
                {(question.userComment || comments[question.id]) && (
                  <div className="comment-preview">
                    <em>Comment: {(question.userComment || comments[question.id]).substring(0, 50)}...</em>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewList;
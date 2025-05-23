import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../services/apiService';
import userService from '../../services/userService';
import Question from './Question';
import ProgressBar from './ProgressBar';

function QuizContainer({ quizConfig, onBack, onUpdateProgress }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState({});
  const [comments, setComments] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const loadQuestions = useCallback(async () => {
    if (!quizConfig) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const params = {
        topic: quizConfig.topic,
        limit: quizConfig.questionCount
      };
      
      if (quizConfig.difficulty) {
        params.difficulty = quizConfig.difficulty;
      }
      
      const response = await apiService.getQuestions(params);
      setQuestions(response);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading questions:', error);
      setIsLoading(false);
    }
  }, [quizConfig]);

  useEffect(() => {
    loadQuestions();
    // Load saved comments for current user
    const currentUser = userService.getCurrentUser();
    if (currentUser) {
      const userComments = userService.getUserComments(currentUser);
      setComments(userComments);
    }
  }, [loadQuestions]);

  const handleAnswerSelect = (answer) => {
    if (showExplanation) return;
    setSelectedAnswer(answer);
  };

  const handleCommentChange = (comment) => {
    const currentQuestion = questions[currentQuestionIndex];
    const currentUser = userService.getCurrentUser();
    
    if (!currentUser) return;
    
    const newComments = {
      ...comments,
      [currentQuestion.id]: comment
    };
    setComments(newComments);
    
    // Save to user-specific storage
    userService.setUserComments(currentUser, newComments);
  };

  const handleSubmit = async () => {
    if (!selectedAnswer) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    // Store answer
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: {
        answer: selectedAnswer,
        isCorrect
      }
    };
    setAnswers(newAnswers);

    // Submit to backend with comment
    try {
      await apiService.submitAnswer({
        questionId: currentQuestion.id,
        answer: selectedAnswer,
        topic: currentQuestion.topic,
        subtopic: currentQuestion.subtopic,
        isCorrect,
        comment: comments[currentQuestion.id] || ''
      });
      onUpdateProgress();
    } catch (error) {
      console.error('Error submitting answer:', error);
    }

    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz completed
      handleQuizComplete();
    }
  };

  const handleQuizComplete = () => {
    const correctCount = Object.values(answers).filter(a => a.isCorrect).length;
    alert(`Quiz completed! You got ${correctCount} out of ${questions.length} correct.`);
    onBack();
  };

  if (!quizConfig) {
    return (
      <div className="card">
        <p>Quiz configuration not found. Please try again.</p>
        <button className="secondary" onClick={onBack}>Back to Menu</button>
      </div>
    );
  }

  if (isLoading) {
    return <div className="card">Loading questions...</div>;
  }

  if (questions.length === 0) {
    return (
      <div className="card">
        <p>No questions available for this topic.</p>
        <button className="secondary" onClick={onBack}>Back to Menu</button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <div className="card">
        <p>Error loading question. Please try again.</p>
        <button className="secondary" onClick={onBack}>Back to Menu</button>
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="quiz-container">
      <button className="secondary back-button" onClick={onBack}>
        Back to Menu
      </button>
      
      <div className="question-card card">
        <div className="question-header">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span className={`difficulty ${currentQuestion.difficulty}`}>
            {currentQuestion.difficulty}
          </span>
        </div>
        
        <ProgressBar progress={progress} />
        
        <Question
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          showExplanation={showExplanation}
          onAnswerSelect={handleAnswerSelect}
          comment={comments[currentQuestion.id] || ''}
          onCommentChange={handleCommentChange}
        />
        
        <div className="navigation">
          {!showExplanation ? (
            <button 
              className="primary"
              onClick={handleSubmit}
              disabled={!selectedAnswer}
            >
              Submit Answer
            </button>
          ) : (
            <button 
              className="primary"
              onClick={handleNext}
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizContainer;
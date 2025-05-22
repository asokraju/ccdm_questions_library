import React from 'react';
import { useQuiz } from '../hooks/useQuiz';
import Question from './Question';
import ProgressBar from './ProgressBar';

function QuizContainer({ quizConfig, onBack, onUpdateProgress }) {
  const {
    questions,
    currentQuestionIndex,
    selectedAnswer,
    showExplanation,
    answers,
    isLoading,
    error,
    selectAnswer,
    submitAnswer,
    nextQuestion,
    results,
    isComplete
  } = useQuiz(quizConfig);

  const handleAnswerSelect = (answer) => {
    if (showExplanation) return;
    selectAnswer(answer);
  };

  const handleSubmit = async () => {
    if (!selectedAnswer) return;
    await submitAnswer();
    onUpdateProgress();
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      nextQuestion();
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = () => {
    alert(`Quiz completed! You got ${results.correct} out of ${results.total} correct.`);
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

  if (error) {
    return (
      <div className="card">
        <p>Error loading quiz: {error}</p>
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
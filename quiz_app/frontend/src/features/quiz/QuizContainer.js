import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../services/apiService';
import apiUserService from '../../services/apiUserService';
import Question from './Question';
import ProgressBar from './ProgressBar';
import ElapsedTimer from './ElapsedTimer';
import CountdownTimer from './CountdownTimer';
import { shuffleAllQuestions } from '../../utils/shuffleOptions';

function QuizContainer({ quizConfig, onBack, onUpdateProgress }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState({});
  const [comments, setComments] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Timing state
  const [timingData, setTimingData] = useState({
    quizStartTime: null,
    questionStartTime: null,
    questionTimings: [],
    isTimedMode: false,
    timePerQuestion: null
  });

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
      // Shuffle the options for each question
      const shuffledQuestions = shuffleAllQuestions(response);
      
      // Debug: Log the shuffling results
      console.log('Question shuffling results:');
      shuffledQuestions.forEach((q, index) => {
        console.log(`Q${index + 1}: Original correct: ${q._originalCorrectAnswer}, New correct: ${q.correctAnswer}`);
      });
      
      setQuestions(shuffledQuestions);
      
      // Initialize timing data
      const now = Date.now();
      setTimingData({
        quizStartTime: now,
        questionStartTime: now,
        questionTimings: [],
        isTimedMode: quizConfig.timerMode === 'timed',
        timePerQuestion: quizConfig.timePerQuestion
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading questions:', error);
      setIsLoading(false);
    }
  }, [quizConfig]);

  useEffect(() => {
    loadQuestions();
    // Load saved comments for current user
    const loadUserComments = async () => {
      const currentUser = apiUserService.getCurrentUser();
      if (currentUser) {
        const userComments = await apiUserService.getUserComments(currentUser);
        setComments(userComments);
      }
    };
    loadUserComments();
  }, [loadQuestions]);

  const handleAnswerSelect = (answer) => {
    if (showExplanation) return;
    setSelectedAnswer(answer);
  };

  const handleCommentChange = async (comment) => {
    const currentQuestion = questions[currentQuestionIndex];
    const currentUser = apiUserService.getCurrentUser();
    
    if (!currentUser) return;
    
    const newComments = {
      ...comments,
      [currentQuestion.id]: comment
    };
    setComments(newComments);
    
    // Save to API and localStorage
    await apiUserService.saveComment(currentUser, currentQuestion.id, comment);
  };

  const handleSubmit = async (wasAutoSubmitted = false) => {
    if (!selectedAnswer && !wasAutoSubmitted) return;

    const currentQuestion = questions[currentQuestionIndex];
    const answerToSubmit = selectedAnswer || null; // null if auto-submitted without selection
    const isCorrect = answerToSubmit === currentQuestion.correctAnswer;
    
    // Calculate time spent on this question
    const questionEndTime = Date.now();
    const timeSpent = questionEndTime - timingData.questionStartTime;
    
    // Store answer with timing data
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: {
        answer: answerToSubmit,
        isCorrect,
        timeSpent,
        wasAutoSubmitted
      }
    };
    setAnswers(newAnswers);
    
    // Store timing data
    const newTimingData = {
      ...timingData,
      questionTimings: [
        ...timingData.questionTimings,
        {
          questionId: currentQuestion.id,
          timeSpent,
          wasAutoSubmitted,
          difficulty: currentQuestion.difficulty,
          isCorrect
        }
      ]
    };
    setTimingData(newTimingData);

    // Submit to backend with comment
    try {
      await apiService.submitAnswer({
        questionId: currentQuestion.id,
        answer: answerToSubmit,
        topic: currentQuestion.topic,
        subtopic: currentQuestion.subtopic,
        isCorrect,
        comment: comments[currentQuestion.id] || '',
        // New timing fields
        timeSpent,
        wasAutoSubmitted,
        quizMode: timingData.isTimedMode ? 'timed' : 'untimed'
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
      
      // Reset question timer for next question
      setTimingData(prev => ({
        ...prev,
        questionStartTime: Date.now()
      }));
    } else {
      // Quiz completed
      handleQuizComplete();
    }
  };
  
  // Handle auto-submit when timer expires
  const handleTimeUp = () => {
    if (!showExplanation) {
      handleSubmit(true); // true = wasAutoSubmitted
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
          <div className="question-header-left">
            <div className="question-info">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span className={`difficulty ${currentQuestion.difficulty}`}>
                {currentQuestion.difficulty}
              </span>
            </div>
          </div>
          <div className="question-header-right">
            <ElapsedTimer 
              startTime={timingData.quizStartTime} 
              isActive={!showExplanation}
            />
            {timingData.isTimedMode && (
              <CountdownTimer
                timeLimit={timingData.timePerQuestion}
                isActive={!showExplanation}
                onTimeUp={handleTimeUp}
                resetKey={currentQuestionIndex} // Reset timer when question changes
              />
            )}
          </div>
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
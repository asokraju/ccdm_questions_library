import React from 'react';
import { QuizContainer, QuizConfig } from '../features/quiz';
import { StudyNotes } from '../features/study';
import { Statistics } from '../features/statistics';
import { ReviewList } from '../features/review';
import { Button, Card } from './ui';

function ViewRouter({ 
  currentView, 
  selectedTopic,
  quizConfig,
  progress,
  onNavigate,
  onSetQuizConfig,
  onUpdateProgress
}) {
  const handleQuizStart = (config) => {
    onSetQuizConfig(config);
    onNavigate('quiz');
  };

  const handleQuizBack = () => {
    onNavigate('menu');
    onSetQuizConfig(null);
  };

  switch (currentView) {
    case 'config':
      return (
        <QuizConfig
          selectedTopic={selectedTopic}
          onStartQuiz={handleQuizStart}
          onBack={handleQuizBack}
        />
      );

    case 'quiz':
      return (
        <>
          {quizConfig ? (
            <QuizContainer
              quizConfig={quizConfig}
              onBack={handleQuizBack}
              onUpdateProgress={onUpdateProgress}
            />
          ) : (
            <Card>
              <p>Quiz configuration error. Please try again.</p>
              <Button 
                variant="secondary" 
                onClick={handleQuizBack}
              >
                Back to Menu
              </Button>
            </Card>
          )}
        </>
      );

    case 'statistics':
      return progress ? (
        <Statistics
          progress={progress}
          onBack={() => onNavigate('menu')}
        />
      ) : null;

    case 'review':
      return (
        <ReviewList
          onBack={() => onNavigate('menu')}
        />
      );

    case 'notes':
      return (
        <StudyNotes
          onBack={() => onNavigate('menu')}
        />
      );

    default:
      return null;
  }
}

export default ViewRouter;
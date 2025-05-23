import React, { Suspense } from 'react';
import { Button, Card } from './ui';
import LoadingSpinner from './LoadingSpinner';

const QuizContainer = React.lazy(() => import('../features/quiz').then(module => ({ default: module.QuizContainer })));
const QuizConfig = React.lazy(() => import('../features/quiz').then(module => ({ default: module.QuizConfig })));
const StudyNotes = React.lazy(() => import('../features/study').then(module => ({ default: module.StudyNotes })));
const Statistics = React.lazy(() => import('../features/statistics').then(module => ({ default: module.Statistics })));
const ReviewList = React.lazy(() => import('../features/review').then(module => ({ default: module.ReviewList })));
const DataExportImport = React.lazy(() => import('../features/dataManagement').then(module => ({ default: module.DataExportImport })));
const CommentManager = React.lazy(() => import('../features/comments').then(module => ({ default: module.CommentManager })));
const UserManagement = React.lazy(() => import('../features/users').then(module => ({ default: module.UserManagement })));

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
        <Suspense fallback={<LoadingSpinner />}>
          <QuizConfig
            selectedTopic={selectedTopic}
            onStartQuiz={handleQuizStart}
            onBack={handleQuizBack}
          />
        </Suspense>
      );

    case 'quiz':
      return (
        <Suspense fallback={<LoadingSpinner />}>
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
        </Suspense>
      );

    case 'statistics':
      return progress ? (
        <Suspense fallback={<LoadingSpinner />}>
          <Statistics
            progress={progress}
            onBack={() => onNavigate('menu')}
          />
        </Suspense>
      ) : null;

    case 'review':
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <ReviewList
            onBack={() => onNavigate('menu')}
          />
        </Suspense>
      );

    case 'notes':
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <StudyNotes
            onBack={() => onNavigate('menu')}
          />
        </Suspense>
      );

    case 'data':
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <DataExportImport
            onBack={() => onNavigate('menu')}
            onUpdateProgress={onUpdateProgress}
          />
        </Suspense>
      );

    case 'comments':
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <CommentManager
            onBack={() => onNavigate('menu')}
          />
        </Suspense>
      );

    case 'users':
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <UserManagement
            onBack={() => onNavigate('menu')}
          />
        </Suspense>
      );

    default:
      return null;
  }
}

export default ViewRouter;
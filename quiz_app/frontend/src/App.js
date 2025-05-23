import React, { useState, useEffect } from 'react';
import { apiService } from './services/apiService';
import { performanceMonitor } from './utils/performance';
import Header from './components/Header';
import MainMenu from './components/MainMenu';
import ViewRouter from './components/ViewRouter';
import './styles/main.css';

function App() {
  const [currentView, setCurrentView] = useState('menu');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [topics, setTopics] = useState([]);
  const [progress, setProgress] = useState(null);
  const [quizConfig, setQuizConfig] = useState(null);

  useEffect(() => {
    // Performance monitoring
    performanceMonitor.logBundleInfo();
    performanceMonitor.checkMemoryUsage();
    
    // Load topics
    apiService.getTopics()
      .then(response => setTopics(response))
      .catch(error => console.error('Error loading topics:', error));
    
    // Load progress
    loadProgress();
  }, []);

  const loadProgress = () => {
    apiService.getProgress()
      .then(response => setProgress(response))
      .catch(error => console.error('Error loading progress:', error));
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all progress?')) {
      apiService.resetProgress()
        .then(() => {
          loadProgress();
          setCurrentView('menu');
          performanceMonitor.trackNavigation('menu (after reset)');
        })
        .catch(error => console.error('Error resetting progress:', error));
    }
  };

  const handleNavigate = (view) => {
    performanceMonitor.trackNavigation(view);
    setCurrentView(view);
  };

  return (
    <div className="container">
      <Header />

      {currentView === 'menu' ? (
        <MainMenu
          topics={topics}
          selectedTopic={selectedTopic}
          onTopicChange={setSelectedTopic}
          onNavigate={handleNavigate}
          onReset={handleReset}
        />
      ) : (
        <ViewRouter
          currentView={currentView}
          selectedTopic={selectedTopic}
          quizConfig={quizConfig}
          progress={progress}
          onNavigate={handleNavigate}
          onSetQuizConfig={setQuizConfig}
          onUpdateProgress={loadProgress}
        />
      )}
    </div>
  );
}

export default App;
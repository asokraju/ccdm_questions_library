import React from 'react';
import TopicSelector from './TopicSelector';
import { Button, Card } from './ui';

const MainMenu = React.memo(function MainMenu({ 
  topics, 
  selectedTopic, 
  onTopicChange, 
  onNavigate, 
  onReset 
}) {
  return (
    <div>
      <TopicSelector
        topics={topics}
        selectedTopic={selectedTopic}
        onTopicChange={onTopicChange}
      />
      
      <Card className="menu">
        <h2>Choose an Option</h2>
        <div className="menu-buttons">
          <Button 
            variant="primary"
            onClick={() => onNavigate('config')}
          >
            Start Quiz
          </Button>
          
          <Button 
            variant="study"
            onClick={() => onNavigate('notes')}
          >
            📖 Study Material
          </Button>
          
          <Button 
            variant="secondary"
            onClick={() => onNavigate('statistics')}
          >
            View Statistics
          </Button>
          
          <Button 
            variant="secondary"
            onClick={() => onNavigate('review')}
          >
            Review Incorrect Answers
          </Button>
          
          <Button 
            variant="secondary"
            onClick={() => onNavigate('comments')}
          >
            💬 Manage Comments
          </Button>
          
          <Button 
            variant="secondary"
            onClick={() => onNavigate('data')}
          >
            📥 Export/Import Data
          </Button>
          
          <Button 
            variant="secondary"
            onClick={() => onNavigate('users')}
          >
            👥 Manage Users
          </Button>
          
          <Button 
            variant="danger"
            onClick={onReset}
          >
            Reset Progress
          </Button>
          
          <Button 
            variant="secondary"
            onClick={() => {
              if (window.confirm('Are you sure you want to logout?')) {
                window.location.reload();
              }
            }}
          >
            🚪 Logout
          </Button>
        </div>
      </Card>
    </div>
  );
});

export default MainMenu;
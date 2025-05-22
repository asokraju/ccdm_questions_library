import React from 'react';
import { useStudyNotes } from '../hooks/useStudyNotes';
import MarkdownRenderer from './MarkdownRenderer';

function StudyNotes({ onBack }) {
  const {
    topics,
    selectedTopic,
    noteContent,
    isLoading,
    error,
    loadNoteContent,
    clearSelectedTopic
  } = useStudyNotes();

  if (isLoading) {
    return (
      <div className="study-notes">
        <button className="secondary back-button" onClick={onBack}>
          Back to Menu
        </button>
        <div className="card">
          <h2>📖 Study Material</h2>
          <p>Loading study topics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="study-notes">
        <button className="secondary back-button" onClick={onBack}>
          Back to Menu
        </button>
        <div className="card">
          <h2>📖 Study Material</h2>
          <div className="error-message">
            <p>{error}</p>
            <button className="secondary" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show individual note content
  if (selectedTopic) {
    return (
      <div className="study-notes">
        <div className="notes-header">
          <button className="secondary back-button" onClick={clearSelectedTopic}>
            ← Back to Topics
          </button>
          <button className="secondary menu-button" onClick={onBack}>
            Main Menu
          </button>
        </div>
        
        <div className="note-content card">
          <div className="note-header">
            <h1>{selectedTopic}</h1>
            <div className="note-actions">
              <button 
                className="secondary"
                onClick={() => window.print()}
              >
                🖨️ Print
              </button>
            </div>
          </div>
          
          <MarkdownRenderer content={noteContent} />
        </div>
      </div>
    );
  }

  // Show topics list
  return (
    <div className="study-notes">
      <button className="secondary back-button" onClick={onBack}>
        Back to Menu
      </button>
      
      <div className="card">
        <h2>📖 Study Material</h2>
        <p>Select a topic to read comprehensive study notes and preparation material.</p>
        
        <div className="topics-grid">
          {topics.map(topic => (
            <div 
              key={topic.name}
              className="topic-card"
              onClick={() => loadNoteContent(topic.name)}
            >
              <div className="topic-title">
                <h3>{topic.name}</h3>
              </div>
              <div className="topic-meta">
                <span className="topic-size">📄 {topic.wordCount || 'N/A'} words</span>
                <span className="topic-read-time">⏱️ {topic.readTime || 'N/A'} min read</span>
              </div>
              <div className="topic-description">
                <p>{topic.description || 'Comprehensive study material and exam preparation notes.'}</p>
              </div>
              <div className="topic-actions">
                <span className="read-more">Read Notes →</span>
              </div>
            </div>
          ))}
        </div>
        
        {topics.length === 0 && (
          <div className="no-topics">
            <p>No study materials available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudyNotes;
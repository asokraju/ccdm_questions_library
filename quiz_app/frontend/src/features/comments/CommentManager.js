import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import './comments.css';

function CommentManager({ onBack }) {
  const [comments, setComments] = useState({});
  const [questions, setQuestions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComments, setSelectedComments] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      // Load comments from localStorage
      const savedComments = localStorage.getItem('quizComments');
      if (savedComments) {
        setComments(JSON.parse(savedComments));
      }
      
      // Load all questions
      const allQuestions = await apiService.getQuestions({ topic: 'all', limit: 1000 });
      setQuestions(allQuestions);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
    }
  };

  const filteredQuestions = questions.filter(question => {
    const hasComment = comments[question.id];
    const matchesFilter = filter === 'all' || (filter === 'commented' && hasComment) || (filter === 'uncommented' && !hasComment);
    const matchesSearch = !searchTerm || 
      question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (comments[question.id] && comments[question.id].toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  const handleCommentUpdate = (questionId, newComment) => {
    const updatedComments = {
      ...comments,
      [questionId]: newComment
    };
    if (!newComment) {
      delete updatedComments[questionId];
    }
    setComments(updatedComments);
    localStorage.setItem('quizComments', JSON.stringify(updatedComments));
  };

  const handleSelectAll = () => {
    if (selectedComments.size === filteredQuestions.length) {
      setSelectedComments(new Set());
    } else {
      setSelectedComments(new Set(filteredQuestions.map(q => q.id)));
    }
  };

  const handleSelect = (questionId) => {
    const newSelected = new Set(selectedComments);
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId);
    } else {
      newSelected.add(questionId);
    }
    setSelectedComments(newSelected);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete comments for ${selectedComments.size} questions?`)) {
      const updatedComments = { ...comments };
      selectedComments.forEach(id => {
        delete updatedComments[id];
      });
      setComments(updatedComments);
      localStorage.setItem('quizComments', JSON.stringify(updatedComments));
      setSelectedComments(new Set());
    }
  };

  const handleExportSelected = () => {
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      comments: {},
      questions: {}
    };

    selectedComments.forEach(id => {
      if (comments[id]) {
        exportData.comments[id] = comments[id];
        const question = questions.find(q => q.id === id);
        if (question) {
          exportData.questions[id] = {
            question: question.question,
            topic: question.topic,
            subtopic: question.subtopic
          };
        }
      }
    });

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `selected-comments-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <div className="card">Loading...</div>;
  }

  return (
    <div>
      <button className="secondary back-button" onClick={onBack}>
        Back to Menu
      </button>

      <div className="card">
        <h2>Comment Manager</h2>
        <p>Manage all your comments in one place</p>

        <div className="comment-manager-controls">
          <div className="filter-controls">
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Questions</option>
              <option value="commented">With Comments</option>
              <option value="uncommented">Without Comments</option>
            </select>
            
            <input
              type="text"
              placeholder="Search questions or comments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="bulk-actions">
            <button 
              className="secondary"
              onClick={handleSelectAll}
              disabled={filteredQuestions.length === 0}
            >
              {selectedComments.size === filteredQuestions.length ? 'Deselect All' : 'Select All'}
            </button>
            
            <button 
              className="primary"
              onClick={handleExportSelected}
              disabled={selectedComments.size === 0}
            >
              Export Selected ({selectedComments.size})
            </button>
            
            <button 
              className="danger"
              onClick={handleBulkDelete}
              disabled={selectedComments.size === 0}
            >
              Delete Selected
            </button>
          </div>
        </div>

        <div className="comment-stats">
          <span>Total Comments: {Object.keys(comments).length}</span>
          <span>Showing: {filteredQuestions.length} questions</span>
        </div>

        <div className="comment-list">
          {filteredQuestions.map(question => (
            <div key={question.id} className="comment-item">
              <div className="comment-item-header">
                <input
                  type="checkbox"
                  checked={selectedComments.has(question.id)}
                  onChange={() => handleSelect(question.id)}
                />
                <div className="question-info">
                  <h4>{question.question}</h4>
                  <small>{question.topic} - {question.subtopic}</small>
                </div>
              </div>
              
              <textarea
                className="comment-edit-textarea"
                value={comments[question.id] || ''}
                onChange={(e) => handleCommentUpdate(question.id, e.target.value)}
                placeholder="Add a comment..."
                rows="2"
              />
            </div>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="no-results">
            <p>No questions found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentManager;
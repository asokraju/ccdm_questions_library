import React, { useState } from 'react';
import { apiService } from '../../services/apiService';
import './dataManagement.css';

function DataExportImport({ onBack, onUpdateProgress }) {
  const [importData, setImportData] = useState(null);
  const [importStatus, setImportStatus] = useState('');
  
  const handleExport = async () => {
    try {
      // Get progress from backend
      const progress = await apiService.getProgress();
      
      // Get comments from localStorage
      const comments = JSON.parse(localStorage.getItem('quizComments') || '{}');
      
      // Combine all data
      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        progress: progress,
        comments: comments,
        metadata: {
          totalQuestions: progress.correct + progress.incorrect,
          totalComments: Object.keys(comments).length
        }
      };
      
      // Create blob and download
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quiz-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setImportStatus('Data exported successfully!');
      setTimeout(() => setImportStatus(''), 3000);
    } catch (error) {
      console.error('Export error:', error);
      setImportStatus('Error exporting data. Please try again.');
    }
  };
  
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setImportData(data);
        setImportStatus('File loaded. Review the data below before importing.');
      } catch (error) {
        setImportStatus('Invalid file format. Please select a valid export file.');
        setImportData(null);
      }
    };
    reader.readAsText(file);
  };
  
  const handleImport = async () => {
    if (!importData) return;
    
    try {
      // Import comments to localStorage
      if (importData.comments) {
        const existingComments = JSON.parse(localStorage.getItem('quizComments') || '{}');
        const mergedComments = { ...existingComments, ...importData.comments };
        localStorage.setItem('quizComments', JSON.stringify(mergedComments));
      }
      
      // Import progress (this would need a new backend endpoint)
      // For now, we'll just show a success message
      setImportStatus(`Successfully imported ${Object.keys(importData.comments || {}).length} comments!`);
      setImportData(null);
      
      // Update parent component
      onUpdateProgress();
      
      // Clear file input
      const fileInput = document.getElementById('import-file');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Import error:', error);
      setImportStatus('Error importing data. Please try again.');
    }
  };
  
  return (
    <div>
      <button className="secondary back-button" onClick={onBack}>
        Back to Menu
      </button>
      
      <div className="card">
        <h2>Export/Import Data</h2>
        <p>Manage your quiz progress and comments</p>
        
        <div className="data-management-section">
          <h3>Export Data</h3>
          <p>Download all your quiz progress and comments as a JSON file.</p>
          <button className="primary" onClick={handleExport}>
            Export All Data
          </button>
        </div>
        
        <hr className="divider" />
        
        <div className="data-management-section">
          <h3>Import Data</h3>
          <p>Import previously exported quiz data. Comments will be merged with existing data.</p>
          
          <input
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="file-input"
            id="import-file"
          />
          <label htmlFor="import-file" className="file-input-label">
            Choose File
          </label>
          
          {importData && (
            <div className="import-preview">
              <h4>Import Preview:</h4>
              <ul>
                <li>Export Date: {new Date(importData.exportDate).toLocaleString()}</li>
                <li>Total Questions Answered: {importData.metadata?.totalQuestions || 0}</li>
                <li>Total Comments: {importData.metadata?.totalComments || 0}</li>
                <li>Correct Answers: {importData.progress?.correct || 0}</li>
                <li>Incorrect Answers: {importData.progress?.incorrect || 0}</li>
              </ul>
              <button className="success" onClick={handleImport}>
                Import This Data
              </button>
            </div>
          )}
        </div>
        
        {importStatus && (
          <div className={`status-message ${importStatus.includes('Error') ? 'error' : 'success'}`}>
            {importStatus}
          </div>
        )}
      </div>
    </div>
  );
}

export default DataExportImport;
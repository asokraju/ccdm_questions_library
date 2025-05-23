import React from 'react';

const ProgressBar = React.memo(function ProgressBar({ progress }) {
  return (
    <div className="progress-bar">
      <div 
        className="progress-fill" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
});

export default ProgressBar;
import React from 'react';

const LoadingSpinner = React.memo(function LoadingSpinner({ size = 'medium', message = 'Loading...' }) {
  const sizeClass = `loading-spinner-${size}`;
  
  return (
    <div className="loading-container">
      <div className={`loading-spinner ${sizeClass}`}>
        <div className="spinner"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
});

export default LoadingSpinner;
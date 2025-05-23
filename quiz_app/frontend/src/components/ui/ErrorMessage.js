import React from 'react';
import Button from './Button';

function ErrorMessage({ 
  title = 'Error',
  message, 
  onRetry, 
  retryText = 'Retry',
  showRetry = true 
}) {
  return (
    <div className="error-message">
      <h3 className="error-title">{title}</h3>
      <p className="error-text">{message}</p>
      {showRetry && onRetry && (
        <Button 
          variant="secondary" 
          onClick={onRetry}
        >
          {retryText}
        </Button>
      )}
    </div>
  );
}

export default ErrorMessage;
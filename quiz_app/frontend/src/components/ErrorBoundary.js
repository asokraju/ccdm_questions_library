import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Check if this is a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    this.setState({
      error: error,
      errorInfo: errorInfo,
      isMobile: isMobile
    });

    // Additional mobile-specific logging
    if (isMobile) {
      console.error('Mobile-specific error detected:', {
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        memory: navigator.deviceMemory || 'unknown',
        connection: navigator.connection?.effectiveType || 'unknown'
      });
    }
  }

  handleReload = () => {
    window.location.reload();
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="card">
            <h2>⚠️ Something went wrong</h2>
            {this.state.isMobile && (
              <div className="mobile-error-notice">
                <p><strong>Mobile Device Detected</strong></p>
                <p>This appears to be a mobile-specific issue.</p>
              </div>
            )}
            
            <div className="error-details">
              <p>An unexpected error occurred. This might be due to:</p>
              <ul>
                <li>Network connectivity issues</li>
                <li>Browser compatibility</li>
                <li>Memory constraints on mobile devices</li>
              </ul>
            </div>

            <div className="error-actions">
              <button 
                className="primary" 
                onClick={this.handleReset}
                style={{ marginRight: '10px' }}
              >
                Try Again
              </button>
              <button 
                className="secondary" 
                onClick={this.handleReload}
              >
                Reload App
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="error-debug" style={{ marginTop: '20px' }}>
                <summary>Debug Information (Development Only)</summary>
                <pre style={{ 
                  background: '#f5f5f5', 
                  padding: '10px', 
                  overflow: 'auto',
                  fontSize: '12px',
                  marginTop: '10px'
                }}>
                  <strong>Error:</strong> {this.state.error && this.state.error.toString()}
                  <br/>
                  <strong>Stack:</strong> {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
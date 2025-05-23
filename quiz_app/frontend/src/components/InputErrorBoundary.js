import React from 'react';

class InputErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.log('Input Error Caught:', error);
    console.log('Error Info:', errorInfo);
    
    // Reset error state after a short delay
    setTimeout(() => {
      this.setState({ hasError: false });
    }, 100);
  }

  render() {
    if (this.state.hasError) {
      // Return the children anyway, but the error is caught
      return this.props.children;
    }

    return this.props.children;
  }
}

export default InputErrorBoundary;
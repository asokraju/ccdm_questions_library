import React from 'react';

// Performance monitoring utilities
export const performanceMonitor = {
  // Measure component render time
  measureRenderTime: (componentName, renderFn) => {
    if (process.env.NODE_ENV === 'development') {
      const startTime = performance.now();
      const result = renderFn();
      const endTime = performance.now();
      console.log(`${componentName} render time: ${(endTime - startTime).toFixed(2)}ms`);
      return result;
    }
    return renderFn();
  },

  // Track navigation timing
  trackNavigation: (routeName) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Navigation to: ${routeName} at ${new Date().toLocaleTimeString()}`);
    }
  },

  // Monitor memory usage
  checkMemoryUsage: () => {
    if (process.env.NODE_ENV === 'development' && performance.memory) {
      const memory = performance.memory;
      console.log('Memory Usage:', {
        used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
        total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`
      });
    }
  },

  // Log bundle size information
  logBundleInfo: () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Bundle analysis available with: npm run analyze');
    }
  }
};

// High-order component for performance tracking
export const withPerformanceTracking = (Component, componentName) => {
  return function PerformanceTrackedComponent(props) {
    return performanceMonitor.measureRenderTime(
      componentName,
      () => React.createElement(Component, props)
    );
  };
};
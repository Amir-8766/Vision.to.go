import { useEffect } from 'react';
import logger from '../lib/logger';

export const usePerformanceMonitor = (componentName) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      logger.trackPerformance(`${componentName} render`, startTime, endTime);
    };
  }, [componentName]);
};

export const useApiPerformanceMonitor = () => {
  const trackApiCall = async (apiCall, method, url) => {
    const startTime = performance.now();
    
    try {
      const response = await apiCall();
      const endTime = performance.now();
      
      logger.trackApiCall(method, url, response.status, endTime - startTime);
      return response;
    } catch (error) {
      const endTime = performance.now();
      logger.trackApiCall(method, url, error.status || 500, endTime - startTime);
      throw error;
    }
  };

  return { trackApiCall };
};

// src/lib/logger.js
class Logger {
  constructor() {
    this.isDevelopment = import.meta.env.VITE_APP_ENVIRONMENT === 'development';
  }

  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Console logging for development
    if (this.isDevelopment) {
      console[level](`[${timestamp}] ${message}`, data || '');
    }

    // Send to monitoring service in production
    if (!this.isDevelopment && level === 'error') {
      this.sendToMonitoring(logEntry);
    }
  }

  info(message, data = null) {
    this.log('info', message, data);
  }

  warn(message, data = null) {
    this.log('warn', message, data);
  }

  error(message, data = null) {
    this.log('error', message, data);
  }

  debug(message, data = null) {
    if (this.isDevelopment) {
      this.log('debug', message, data);
    }
  }

  async sendToMonitoring(logEntry) {
    try {
      // In a real application, you would send this to your monitoring service
      // For now, we'll just store it in localStorage for debugging
      const logs = JSON.parse(localStorage.getItem('error_logs') || '[]');
      logs.push(logEntry);
      
      // Keep only last 50 error logs
      if (logs.length > 50) {
        logs.splice(0, logs.length - 50);
      }
      
      localStorage.setItem('error_logs', JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to send log to monitoring:', error);
    }
  }

  // Performance monitoring
  trackPerformance(name, startTime, endTime) {
    const duration = endTime - startTime;
    this.info(`Performance: ${name}`, { duration: `${duration}ms` });
    
    // Track slow operations
    if (duration > 1000) {
      this.warn(`Slow operation detected: ${name}`, { duration: `${duration}ms` });
    }
  }

  // User action tracking
  trackUserAction(action, data = {}) {
    this.info(`User Action: ${action}`, data);
  }

  // API call tracking
  trackApiCall(method, url, status, duration) {
    const level = status >= 400 ? 'error' : 'info';
    this.log(level, `API Call: ${method} ${url}`, {
      status,
      duration: `${duration}ms`
    });
  }
}

// Create singleton instance
const logger = new Logger();

export default logger;

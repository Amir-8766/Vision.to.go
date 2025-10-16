// src/lib/analytics.js
import logger from './logger';

class Analytics {
  constructor() {
    this.isEnabled = import.meta.env.VITE_APP_ENVIRONMENT === 'production';
  }

  // Track page views
  trackPageView(pageName, pageData = {}) {
    if (!this.isEnabled) return;
    
    logger.trackUserAction('page_view', {
      page: pageName,
      ...pageData
    });
  }

  // Track user interactions
  trackEvent(eventName, eventData = {}) {
    if (!this.isEnabled) return;
    
    logger.trackUserAction(eventName, eventData);
  }

  // Track e-commerce events
  trackPurchase(orderData) {
    if (!this.isEnabled) return;
    
    logger.trackUserAction('purchase', {
      order_id: orderData._id,
      total: orderData.totalPrice,
      items: orderData.items.length,
      currency: 'EUR'
    });
  }

  trackAddToCart(productData) {
    if (!this.isEnabled) return;
    
    logger.trackUserAction('add_to_cart', {
      product_id: productData._id,
      product_name: productData.name,
      price: productData.price
    });
  }

  trackRemoveFromCart(productData) {
    if (!this.isEnabled) return;
    
    logger.trackUserAction('remove_from_cart', {
      product_id: productData._id,
      product_name: productData.name
    });
  }

  // Track search events
  trackSearch(searchTerm, resultsCount) {
    if (!this.isEnabled) return;
    
    logger.trackUserAction('search', {
      search_term: searchTerm,
      results_count: resultsCount
    });
  }

  // Track user registration/login
  trackUserRegistration(userData) {
    if (!this.isEnabled) return;
    
    logger.trackUserAction('user_registration', {
      user_id: userData.id,
      registration_method: 'email'
    });
  }

  trackUserLogin(userData) {
    if (!this.isEnabled) return;
    
    logger.trackUserAction('user_login', {
      user_id: userData.id
    });
  }
}

// Create singleton instance
const analytics = new Analytics();

export default analytics;

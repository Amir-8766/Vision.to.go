// src/lib/stripe.js
import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 
  'pk_test_51RdaawIHmfIW1XwW1vpUdbnY3i9lqzR8X8KfCqXzM3wgIAHGnLjOj12TzCQjq1SuBbTMVp78VwWtRqkKCOv1LC2K00ZSm5SxXl';

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export const getStripeConfig = () => {
  return {
    publishableKey: STRIPE_PUBLISHABLE_KEY,
    isTestMode: STRIPE_PUBLISHABLE_KEY.includes('pk_test_'),
    environment: import.meta.env.VITE_APP_ENVIRONMENT || 'development'
  };
};

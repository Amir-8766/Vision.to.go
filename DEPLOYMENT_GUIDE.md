# Deployment Guide - Security Checklist

## 🔒 Security Requirements for Production

### 1. **Remove Test Token**

Before deploying to production, ensure the test token is removed:

**File**: `src/pages/AdminDashboard.jsx`
**Lines**: 47-53

```javascript
// ❌ REMOVE THIS IN PRODUCTION
// if (!localStorage.getItem("token")) {
//   localStorage.setItem("token", "test-token-here");
// }
```

### 2. **Environment Variables**

Create a `.env` file for production:

```env
VITE_API_BASE_URL=https://your-api-domain.com
NODE_ENV=production
```

### 3. **JWT Token Security**

- Ensure JWT tokens are properly signed with a strong secret
- Set appropriate expiration times
- Use HTTPS in production
- Implement token refresh mechanism

### 4. **Role-Based Access Control**

- Verify that admin routes are properly protected
- Test with different user roles
- Ensure non-admin users cannot access admin pages

### 5. **API Security**

- Implement rate limiting
- Add CORS configuration
- Use HTTPS for all API calls
- Validate all inputs

## 🚀 Deployment Steps

### 1. **Build the Application**

```bash
npm run build
```

### 2. **Remove Test Code**

- Comment out or remove test token logic
- Remove console.log statements
- Remove development-only features

### 3. **Environment Setup**

- Set `NODE_ENV=production`
- Configure production API endpoints
- Set up proper SSL certificates

### 4. **Security Testing**

- Test authentication flow
- Verify role-based access
- Test with different user types
- Check for security vulnerabilities

## ⚠️ Important Notes

- **Never commit tokens to version control**
- **Use environment variables for sensitive data**
- **Implement proper error handling**
- **Add logging for security events**
- **Regular security audits**

## 🔍 Pre-Deployment Checklist

- [ ] Test token removed
- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] Role-based access tested
- [ ] Error handling implemented
- [ ] Console logs removed
- [ ] Security headers configured
- [ ] API endpoints secured

# Testing Guide for Admin Dashboard

## 🔧 Setup Backend

1. **Install Dependencies:**

```bash
cd backend
npm install
```

2. **Create .env file in backend folder:**

```env
JWT_SECRET=your-super-secret-jwt-key-here-2024
MONGODB_URI=mongodb://localhost:27017/mir-femme
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
```

3. **Start Backend Server:**

```bash
cd backend
node index.js
```

## 👤 Create Admin User

Use this API call to create an admin user:

```bash
curl -X POST http://192.168.178.103:4242/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "admin123",
    "first_name": "Admin",
    "last_name": "User"
  }'
```

Or use Postman/Thunder Client with:

- **URL:** `http://192.168.178.103:4242/auth/create-admin`
- **Method:** POST
- **Body (JSON):**

```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "admin123",
  "first_name": "Admin",
  "last_name": "User"
}
```

## 🔐 Login as Admin

1. Go to `/login` page
2. Use credentials:
   - **Email:** admin@example.com
   - **Password:** admin123
3. After login, you'll see admin icon in navigation
4. Click on admin icon or go to `/admin-dashboard`

## 🎯 Test Dashboard Features

### Dashboard Tab:

- ✅ Statistics cards with trends
- ✅ Revenue chart
- ✅ Order status distribution
- ✅ Top selling products
- ✅ Recent activity

### Orders Tab:

- ✅ View all orders
- ✅ Filter by status
- ✅ Update order status
- ✅ Export functionality

### Users Tab:

- ✅ View all users
- ✅ Search users
- ✅ User management

### Reports:

- ✅ Generate reports modal
- ✅ Export to PNG/CSV
- ✅ Custom date ranges

## 🚨 Troubleshooting

### 401 Unauthorized Error:

- Make sure you're logged in
- Check if token exists in localStorage
- Try logging out and logging in again

### Backend Connection Error:

- Make sure backend server is running on port 4242
- Check if MongoDB is running
- Verify IP address in `src/lib/api.js`

### Dashboard Not Loading:

- Check browser console for errors
- Verify all API endpoints are working
- Make sure user has admin role

## 📊 Expected Features

1. **Authentication:**

   - Login required for dashboard access
   - Automatic redirect to login if not authenticated
   - Token-based authentication

2. **Dashboard Analytics:**

   - Real-time statistics
   - Interactive charts
   - Revenue trends
   - Order analytics

3. **Management:**

   - Order management
   - User management
   - Product management (links to main admin)

4. **Reports:**
   - Custom report generation
   - Multiple export formats
   - Date range selection

## 🎨 Color Palette Used

- **Light Pink:** #EDDCD9
- **Off White:** #F2EBE9
- **Bright Pink:** #DE5499
- **Dark Teal:** #264143
- **Orange:** #E9944C

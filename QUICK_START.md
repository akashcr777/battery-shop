# Quick Start Guide

## Step 1: Setup MongoDB

Make sure MongoDB is running on your system:
- **Local MongoDB**: Start MongoDB service
- **MongoDB Atlas**: Get connection string from MongoDB Atlas dashboard

## Step 2: Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/pilot-battery-shop
JWT_SECRET=your-secret-key-change-in-production
```

Start backend:
```bash
npm start
```

Seed sample data (optional):
```bash
node seed.js
```

## Step 3: Frontend Setup

```bash
cd frontend
npm install
```

Start frontend:
```bash
npm start
```

## Step 4: Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Default Admin Credentials

After running `node seed.js`:
- Email: `admin@pilotbattery.com`
- Password: `admin123`

## Testing the Application

1. Register a new user account
2. Login and browse inventory
3. Add products to cart
4. Place an order with delivery address
5. Login as admin to view and manage orders
6. Update order status to see tracking updates

## Important Notes

- Update shop location coordinates in `frontend/src/pages/Contact.js` (line 5-6)
- The Google Maps embed works without API key for basic usage
- For production, use a proper Google Maps API key


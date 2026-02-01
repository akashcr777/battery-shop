<<<<<<< HEAD
# Pilot Battery Shop - Full Stack E-Commerce Application

A complete e-commerce platform for battery and UPS sales with delivery tracking, built with React and MongoDB.

## Features

- 🔐 User Authentication (Login/Register)
- 📦 Product Inventory Management
  - Battery Categories: Vehicle (Two-wheeler, Three-wheeler, Four-wheeler, Truck Series) & Home Batteries
  - UPS Systems with multiple types
- 🛒 Shopping Cart & Checkout
- 📋 Order Management with Live Billing
- 📍 Location Tracking for Delivery
- 👨‍💼 Admin Dashboard
  - View all orders
  - Update order status
  - View customer locations on map
- 📱 Fully Responsive Design
- 🗺️ Contact Page with Shop Location Map

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios
- CSS3 (Responsive Design)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/pilot-battery-shop
JWT_SECRET=your-secret-key-change-in-production
```

4. Start the backend server:
```bash
npm start
```

5. (Optional) Seed sample data:
```bash
node seed.js
```

This will create:
- Admin user: `admin@pilotbattery.com` / `admin123`
- Sample products in all categories

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/location` - Update user location

### Products
- `GET /api/products` - Get all products (with optional query params: category, subCategory)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders` - Get all orders (Admin only)
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (Admin only)

## User Flow

1. **Registration/Login**: Users register or login to access the inventory
2. **Browse Products**: Navigate through Battery and UPS categories
3. **Add to Cart**: Select products and add them to cart
4. **Checkout**: Enter delivery address and place order
5. **Order Tracking**: View order status updates
6. **Admin Management**: Admin can view orders, update status, and track delivery locations

## Order Status Flow

1. **Pending** - Order placed, awaiting admin acceptance
2. **Accepted** - Admin accepted the order
3. **Ready to Deliver** - Product ready for delivery
4. **Out for Delivery** - Product dispatched
5. **Delivered** - Order completed

## Contact Information

- **Phone**: 6374073238
- **Shop Location**: Update coordinates in `frontend/src/pages/Contact.js`

## Project Structure

```
pilot-battery-shop/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   └── orders.js
│   ├── server.js
│   ├── seed.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Features in Detail

### Responsive Design
- Mobile-first approach
- Works seamlessly on all device sizes
- Touch-friendly interface

### Location Tracking
- Automatic GPS location capture during checkout
- Admin can view customer location on Google Maps
- Direct link to navigate to delivery location

### Real-time Updates
- Admin dashboard auto-refreshes every 5 seconds
- Order status updates in real-time
- Live billing records

## Security Features
- Password hashing with bcrypt
- JWT token-based authentication
- Protected routes
- Role-based access control (Admin/Customer)

## Future Enhancements
- Payment gateway integration
- Email notifications
- SMS alerts
- Product reviews and ratings
- Wishlist functionality
- Advanced search and filters

## License

This project is open source and available for use.

## Support

For issues or questions, please contact: 6374073238


# pilot-battery-shop
react  


# Statiz - E-commerce Platform

A full-featured e-commerce application built with vanilla JavaScript, HTML, CSS, and JSON Server backend.

## Features

### 🛍️ Shopping
- **Product Categories**: Art & Crafts and Stationery Items
- **Product Grid**: Responsive grid layout with product cards
- **Add to Cart**: Add products to shopping cart with price tracking
- **Cart Management**: View cart with items count and total price

### 🛒 Checkout & Orders
- **Full Checkout Flow**: 
  - Delivery details form
  - Payment information form
  - Real-time validation and formatting
- **Order Confirmation**: Immediate confirmation with order details
- **Order History**: View all past orders with status

### 👤 User Management
- **User Registration**: Create new accounts with name, email, password
- **User Login**: Secure login with credentials verification
- **Admin Panel**: Manage products and view orders
- **User Profile**: View order history and details

### 🔒 Authorization
- **Login Required**: Product pages require authentication
- **Admin Access**: Admin panel requires admin credentials
- **Session Management**: Logout clears all session data

### 📊 Admin Dashboard
- **Add Products**: Create new products
- **View Users**: Manage registered users
- **Delete Users**: Remove users from system

## Getting Started

### Prerequisites
- Node.js and npm installed
- Web browser

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start JSON Server:**
```bash
npm run json-server
```
Server will run on `http://localhost:3000`

3. **Open the application:**
```bash
# Open index.html in browser or use a local server
# Recommended: Use VS Code Live Server extension
```

## Default Credentials

### User Account
- **Email**: user@example.com
- **Password**: password123

### Admin Account
- **Email**: admin@statiz.com
- **Password**: admin123

## API Endpoints

### Users
- `GET /users` - Get all users
- `POST /users` - Create new user
- `GET /users/:id` - Get specific user
- `DELETE /users/:id` - Delete user

### Admin
- `GET /admin` - Get admin credentials

### Orders
- `GET /orders` - Get all orders
- `POST /orders` - Create new order
- `GET /orders/:id` - Get specific order
- `GET /orders?customerEmail=email` - Get orders by email

## File Structure

```
Statiz/
├── index.html              # Home page
├── login.html              # Login/Register page
├── admin.html              # Admin dashboard
├── art-crafts.html         # Art & Crafts products
├── stationery.html         # Stationery products
├── checkout.html           # Checkout form
├── order-confirmation.html # Order confirmation
├── myorders.html           # User's order history
├── db.json                 # JSON Server database
├── package.json            # Dependencies
│
├── styles/
│   ├── navbar.css          # Navigation bar
│   ├── index.css           # Home page styles
│   ├── products.css        # Product pages
│   ├── login.css           # Login page
│   ├── admin.css           # Admin panel
│   ├── checkout.css        # Checkout page
│   ├── confirmation.css    # Confirmation page
│   └── myorders.css        # Orders history
│
└── scripts/
    ├── navbar.js           # Navigation logic
    ├── auth.js             # Authentication utilities
    ├── checkout.js         # Checkout logic
    ├── confirmation.js     # Confirmation page logic
    ├── myorders.js         # Orders page logic
```

## User Flow

### Shopping Flow
1. Visit home page → Select category (Art & Crafts or Stationery)
2. Browse products → Add items to cart
3. Click Checkout → Login if not already
4. Fill delivery & payment details
5. Place order → See confirmation
6. View order in "My Orders"

### Registration Flow
1. Click Login button
2. Toggle to "Create Account"
3. Enter name, email, password
4. Account created → Can now login

### Admin Flow
1. Login with admin credentials
2. Access admin panel
3. View registered users
4. Delete users if needed
5. Add new products (form ready)

## Features Breakdown

### Authorization System
- Uses localStorage for session management
- Login page validates against JSON Server
- Product pages check `localStorage.userEmail`
- Admin page checks `localStorage.isAdmin`
- Logout clears all session data

### Checkout System
- Cart saved to localStorage during checkout
- Form validates:
  - Phone number (10 digits)
  - Card number (auto-formatted)
  - Expiry date (MM/YY format)
  - CVV (3 digits)
- Order sent to JSON Server `/orders`
- Generates unique order ID
- Calculates tax (10% of subtotal)

### Order Management
- Orders stored in JSON Server
- Users see only their orders
- Status tracking (pending, shipped, delivered, cancelled)
- Order details include:
  - Customer info
  - Delivery address
  - Items ordered
  - Total price breakdown
  - Payment method

## Responsive Design
- Mobile-first approach
- Hamburger menu for mobile navigation
- Responsive grid layouts
- Touch-friendly buttons and forms

## Technologies Used
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: JSON Server (REST API)
- **Storage**: localStorage (client-side)
- **Styling**: CSS Grid, Flexbox

## Future Enhancements
- [ ] Email notifications
- [ ] Payment gateway integration
- [ ] Product search and filters
- [ ] Review and ratings
- [ ] Wishlist feature
- [ ] Coupon/promo codes
- [ ] Inventory management
- [ ] Order tracking with real-time updates
- [ ] User profile customization

## Troubleshooting

### "json-server not recognized"
Solution: Run `npm run json-server` instead of calling json-server directly

### Port 3000 already in use
Solution: Kill existing processes or use different port in package.json

### Cart empty at checkout
Solution: Make sure cart items are saved to localStorage before redirecting

### Orders not saving
Solution: Ensure JSON Server is running and `/orders` endpoint is accessible

## Support
For issues or questions, check the console for error messages using F12 Developer Tools.

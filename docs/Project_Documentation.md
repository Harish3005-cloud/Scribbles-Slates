# Scribbles & Slates — Project Documentation

## 1. Project Overview
**Scribbles & Slates** is a fully functional, full-stack E-Commerce web application built using the **MERN** stack (MongoDB, Express.js, React, Node.js). It features a modern storefront for premium stationery, secure user authentication, role-based access control (RBAC), a secure admin dashboard with image uploads, dynamic cart synchronization, and Razorpay integration for seamless checkouts.

## 2. Project Structure
The application is strictly separated into a client (React) and a server (Node.js/Express) environment.

### Backend (`/server`)
- **`models/`**: MongoDB Mongoose Schemas (`User.js`, `Inventory.js`, `Cart.js`, `Order.js`).
- **`routes/`**: Express API controllers (`auth.js`, `inventory.js`, `cart.js`, `payment.js`).
- **`middleware/`**: Custom logic interceptors (`auth.js` for JWT/Admin checks, `stockCheck.js` for inventory validation).
- **`utils/`**: Shared logic (`pricing.js` for bulk discount calculations).
- **`public/images/`**: Local storage for uploaded product images.

### Frontend (`/src`)
- **`components/`**: Reusable UI elements (`ProductCard`, `CategoryBar`, `CartDrawer`, `Header`).
- **`pages/`**: Primary route views (`Storefront`, `ProductDetail`, `Checkout`, `AdminDashboard`).
- **`context/`**: Global state management (`AuthContext.jsx`, `CartContext.jsx`).
- **`index.css`**: Tailwind CSS configuration and custom styling directives.

---

## 3. Development Phases

### Phase 1: Foundation & Styling
- Initialized the React + Vite frontend and Express + Node backend.
- Configured **Tailwind CSS** with a custom brand color palette (Ink, Parchment, Cream, Gold).
- Designed the core responsive layout, including the Navigation Header and Product Grid.

### Phase 2: Database & Authentication
- Implemented MongoDB schemas using Mongoose.
- Created the **User Auth System** using JSON Web Tokens (JWT) and bcrypt for password hashing.
- Established the `role` property (`user` vs `admin`) to prepare for Role-Based Access Control.

### Phase 3: The Admin Dashboard
- **Security**: Built the `requireAdmin` middleware to protect sensitive API routes.
- **Image Handling**: Integrated `multer` to handle multipart/form-data for uploading product images directly to the server's `public/images/` directory.
- **CRUD Operations**: Developed the React `/admin` page interface allowing admins to visually Add, Edit, and Delete products, updating the live storefront instantly.

### Phase 4: Cart Synchronization & Context
- Built the highly resilient `CartContext` in React to manage optimistic UI updates.
- Designed a hybrid persistence system:
  - **Guests**: Cart is stored in browser `localStorage`.
  - **Logged-In Users**: Cart is securely stored in MongoDB.
  - **The Sync**: Upon login, the guest cart is automatically merged into the database cart, preserving the user's shopping journey seamlessly across devices.

### Phase 5: Checkout & Razorpay Integration
- **Backend Flow**: Created `/api/payment/create-order` to validate stock, calculate the final price (applying 20% bulk discounts), and generate a unique Razorpay Order ID.
- **Frontend Flow**: Built the `Checkout.jsx` form to collect shipping details and securely open the Razorpay payment modal using the generated Order ID.
- **Verification**: Created `/api/payment/verify` to cryptographically verify Razorpay's HMAC signature. Upon success, the system deducts the purchased inventory stock, marks the Order as `paid`, and empties the user's cart.

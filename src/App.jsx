import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import Storefront from './pages/Storefront.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

/**
 * App — root routing component.
 * The landing page has been removed; "/" is now the Storefront (product catalog).
 */
export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream font-sans">
      {/* Persistent Header on every page */}
      <Header onCartOpen={() => setIsCartOpen(true)} />

      {/* Page Routes */}
      <Routes>
        <Route path="/"               element={<Storefront />} />
        <Route path="/product/:id"    element={<ProductDetail />} />
        <Route path="/checkout"       element={<Checkout />} />
        <Route path="/order-success"  element={<OrderConfirmation />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/register"       element={<Register />} />
        <Route path="/admin"          element={<AdminDashboard />} />
      </Routes>

      {/* Persistent Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

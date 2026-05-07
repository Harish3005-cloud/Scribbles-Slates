import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, MapPin, Phone, User, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const API = 'http://localhost:5000/api';

const EMPTY_ADDR = {
  fullName: '', line1: '', line2: '', city: '', state: '', pincode: '', phone: '',
};

export default function Checkout() {
  const { token, user }       = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const navigate              = useNavigate();

  const [address, setAddress] = useState(EMPTY_ADDR);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [stockError, setStockError] = useState(null);

  // Redirect guests to login
  if (!token) {
    return (
      <div className="page-container py-24 flex flex-col items-center gap-4 text-center">
        <ShoppingBag size={48} className="text-gray-300" />
        <h2 className="font-serif text-2xl text-gray-700">Sign in to Checkout</h2>
        <p className="text-slate">You need to be logged in to place an order.</p>
        <Link to="/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-container py-24 flex flex-col items-center gap-4 text-center">
        <ShoppingBag size={48} className="text-gray-300" />
        <h2 className="font-serif text-2xl text-gray-700">Your cart is empty</h2>
        <Link to="/" className="btn-primary">Browse Catalog</Link>
      </div>
    );
  }

  const validate = () => {
    const errs = {};
    if (!address.fullName.trim()) errs.fullName = 'Full name is required';
    if (!address.line1.trim())    errs.line1    = 'Address line 1 is required';
    if (!address.city.trim())     errs.city     = 'City is required';
    if (!address.state.trim())    errs.state    = 'State is required';
    if (!/^\d{6}$/.test(address.pincode)) errs.pincode = 'Valid 6-digit pincode required';
    if (!/^\d{10}$/.test(address.phone))  errs.phone   = 'Valid 10-digit phone required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setLoading(true);
    setStockError(null);

    try {
      // 1. Create Razorpay order on backend
      const res = await fetch(`${API}/payment/create-order`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ shippingAddress: address }),
      });
      const data = await res.json();

      if (res.status === 409) {
        setStockError(data.message + (data.errors
          ? ': ' + data.errors.map(e => e.message).join(', ')
          : ''));
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error(data.message);

      // 2. Open Razorpay checkout modal
      const options = {
        key:         data.keyId,
        amount:      data.amount,
        currency:    data.currency,
        name:        'Scribbles & Slates',
        description: 'Premium Stationery Order',
        order_id:    data.razorpayOrderId,
        prefill:     data.prefill,
        theme:       { color: '#264653' },
        handler: async (response) => {
          // 3. Verify payment on backend
          const verifyRes = await fetch(`${API}/payment/verify`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body:    JSON.stringify({
              orderId:           data.orderId,
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            clearCart();
            navigate(`/order-success?orderId=${verifyData.orderId}`);
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload  = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const field = (key, label, placeholder, icon) => (
    <div>
      <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate">{icon}</span>}
        <input
          id={key}
          type="text"
          placeholder={placeholder}
          value={address[key]}
          onChange={e => setAddress(a => ({ ...a, [key]: e.target.value }))}
          className={`input-field ${icon ? 'pl-9' : ''} ${errors[key] ? 'border-danger focus:ring-danger/30 focus:border-danger' : ''}`}
        />
      </div>
      {errors[key] && <p className="text-danger text-xs mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="page-container py-8 animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-ink mb-6 transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Continue Shopping
      </Link>

      <h1 className="font-serif text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Address Form ─────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <MapPin size={18} className="text-ink" />
              <h2 className="font-serif text-lg font-semibold">Shipping Address</h2>
            </div>

            {field('fullName', 'Full Name', 'John Doe', <User size={15} />)}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field('line1', 'Address Line 1', '123, MG Road')}
              {field('line2', 'Address Line 2 (Optional)', 'Apt 4B')}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {field('city',    'City',    'Hyderabad')}
              {field('state',   'State',   'Telangana')}
              {field('pincode', 'Pincode', '500001')}
            </div>

            {field('phone', 'Phone Number', '9876543210', <Phone size={15} />)}
          </div>
        </div>

        {/* ── Order Summary ────────────────────────────────── */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-card p-6 space-y-4 sticky top-20">
            <h2 className="font-serif text-lg font-semibold pb-2 border-b border-gray-100">
              Order Summary
            </h2>

            <ul className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map(item => (
                <li key={`${item.productId}-${item.variantSku ?? 'base'}`}
                    className="flex gap-3 items-start text-sm">
                  <div className="w-12 h-12 rounded-lg bg-parchment overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name}
                         className="w-full h-full object-cover"
                         onError={e => { e.target.style.display='none'; }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 leading-snug">{item.name}</p>
                    {item.variantName && <p className="text-slate text-xs">{item.variantName}</p>}
                    <p className="text-slate text-xs">Qty: {item.qty}</p>
                    {item.discountApplied && (
                      <span className="text-xs text-warning font-medium">20% bulk discount</span>
                    )}
                  </div>
                  <p className="font-semibold text-ink shrink-0">₹{item.lineTotal.toFixed(2)}</p>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-100 pt-3 space-y-2">
              <div className="flex justify-between text-sm text-slate">
                <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate">
                <span>Shipping</span><span className="text-success">Free</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="font-serif text-ink text-lg">₹{subtotal.toFixed(2)}</span>
              </div>
            </div>

            {stockError && (
              <div className="bg-danger/5 border border-danger/20 rounded-lg p-3 text-sm text-danger">
                {stockError}
              </div>
            )}

            <button
              id="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base"
            >
              {loading
                ? <><Loader2 size={18} className="animate-spin" /> Processing…</>
                : 'Pay with Razorpay'
              }
            </button>

            <p className="text-xs text-slate text-center">
              🔒 Secured by Razorpay. Your payment info is never stored on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

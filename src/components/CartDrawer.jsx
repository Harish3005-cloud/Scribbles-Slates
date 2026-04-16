import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';

const CartDrawer = ({ isOpen, onClose, cartItems, removeFromCart }) => {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="drawer-backdrop" onClick={onClose} />}
      
      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <div className="cart-title">
            <ShoppingBag size={20} />
            <h2 className="font-serif">Your Cart</h2>
          </div>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty.</p>
              <button onClick={onClose} className="btn-secondary mt-4 w-full justify-center">
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="cart-items-list">
              {cartItems.map((item, idx) => (
                <li key={idx} className="cart-item">
                  <div className="cart-item-image">
                    {/* Tiny placeholder image */}
                    <img src={item.variant?.image || item.image} alt={item.name} />
                  </div>
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    {item.variant && <span className="cart-item-variant">{item.variant.name}</span>}
                    <p className="cart-item-price">${item.price.toFixed(2)}</p>
                  </div>
                  <button onClick={() => removeFromCart(idx)} className="remove-item-btn" title="Remove item">
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span className="font-serif">${total.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary w-full justify-center" style={{ borderRadius: '0.75rem' }}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;

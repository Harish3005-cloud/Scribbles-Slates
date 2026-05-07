import React from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, ShoppingBag, Plus, Minus, Tag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer({ isOpen, onClose }) {
  const { items, subtotal, itemCount, removeItem, updateQty } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`cart-drawer flex flex-col z-50 ${isOpen ? 'open' : ''}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-ink" />
            <h2 className="font-serif text-lg font-semibold text-gray-800">Your Cart</h2>
            {itemCount > 0 && (
              <span className="badge bg-ink text-cream">{itemCount}</span>
            )}
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={48} className="text-gray-200" />
              <div>
                <p className="font-serif text-gray-700 font-medium">Your cart is empty</p>
                <p className="text-slate text-sm mt-1">Add items from the catalog to get started</p>
              </div>
              <button onClick={onClose} className="btn-primary mt-2">
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item, idx) => (
                <li key={`${item.productId}-${item.variantSku ?? 'base'}`}
                    className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 animate-fade-in">

                  {/* Image */}
                  <div className="w-16 h-16 rounded-lg bg-parchment overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name}
                         className="w-full h-full object-cover"
                         onError={e => { e.target.style.display = 'none'; }} />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-800 truncate">{item.name}</h4>
                    {item.variantName && (
                      <p className="text-xs text-slate mt-0.5">{item.variantName}</p>
                    )}

                    {/* Bulk discount badge */}
                    {item.discountApplied && (
                      <span className="badge-discount flex items-center gap-1 mt-1 w-fit text-xs">
                        <Tag size={10} /> 20% bulk off
                      </span>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      {/* Qty controls */}
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQty(item.productId, item.variantSku, item.qty - 1)}
                          className="px-2 py-1 text-slate hover:bg-parchment hover:text-ink text-sm transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 text-sm font-medium text-gray-800">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.productId, item.variantSku, item.qty + 1)}
                          className="px-2 py-1 text-slate hover:bg-parchment hover:text-ink text-sm transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <p className="text-sm font-semibold text-ink">
                        ₹{item.lineTotal.toFixed(2)}
                        {item.discountApplied && (
                          <span className="text-slate line-through text-xs ml-1 font-normal">
                            ₹{(item.priceAtAdd * item.qty).toFixed(2)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.productId, item.variantSku)}
                    className="text-slate hover:text-danger transition-colors self-start p-1"
                  >
                    <Trash2 size={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 space-y-3 bg-parchment/50">
            <div className="flex justify-between text-base">
              <span className="font-medium text-gray-700">Subtotal</span>
              <span className="font-serif font-bold text-ink text-lg">₹{subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-slate">Shipping & taxes calculated at checkout</p>
            <Link
              to="/checkout"
              onClick={onClose}
              className="btn-primary w-full justify-center py-3 text-base"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

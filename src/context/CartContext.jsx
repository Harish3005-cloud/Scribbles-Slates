import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
const API = 'http://localhost:5000/api';
const LS_KEY = 'ss_cart';

// ─── Pricing logic (mirrors backend utils/pricing.js) ────────────────────────
function calculateTotal(items = []) {
  // Filter out any broken items that don't have prices or valid quantities
  const validItems = items.filter(i => i && typeof i.priceAtAdd === 'number' && !Number.isNaN(i.priceAtAdd) && i.qty > 0);
  
  const lineItems = validItems.map(item => {
    const discount    = item.qty > 10 ? 0.80 : 1.0;
    const lineTotal   = parseFloat((item.priceAtAdd * item.qty * discount).toFixed(2));
    return { ...item, discountApplied: item.qty > 10, discount: item.qty > 10 ? 20 : 0, lineTotal };
  });
  const subtotal = parseFloat(lineItems.reduce((s, i) => s + i.lineTotal, 0).toFixed(2));
  return { lineItems, subtotal };
}

// ─── Reducer ─────────────────────────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload };

    case 'ADD_ITEM': {
      const { item } = action.payload;
      const existing = state.items.find(
        i => i.productId === item.productId && i.variantSku === item.variantSku
      );
      if (existing) {
        return { ...state, items: state.items.map(i =>
          (i.productId === item.productId && i.variantSku === item.variantSku)
            ? { ...i, qty: i.qty + item.qty }
            : i
        )};
      }
      return { ...state, items: [...state.items, item] };
    }

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(
        i => !(i.productId === action.payload.productId && i.variantSku === action.payload.variantSku)
      )};

    case 'UPDATE_QTY':
      if (action.payload.qty <= 0) {
        return { ...state, items: state.items.filter(
          i => !(i.productId === action.payload.productId && i.variantSku === action.payload.variantSku)
        )};
      }
      return { ...state, items: state.items.map(i =>
        (i.productId === action.payload.productId && i.variantSku === action.payload.variantSku)
          ? { ...i, qty: action.payload.qty }
          : i
      )};

    case 'CLEAR':
      return { ...state, items: [] };

    default:
      return state;
  }
}

function loadFromLS() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LS_KEY)) || [];
    // Aggressively filter out any corrupted items from local storage
    return parsed.filter(i => i && typeof i.priceAtAdd === 'number' && !Number.isNaN(i.priceAtAdd) && i.qty > 0 && i.name && i.productId);
  } catch {
    return [];
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function CartProvider({ children }) {
  const { user, token } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Initialise: load from localStorage on mount
  useEffect(() => {
    dispatch({ type: 'SET_ITEMS', payload: loadFromLS() });
  }, []);

  // Persist guest cart to localStorage whenever items change
  useEffect(() => {
    if (!token) {
      localStorage.setItem(LS_KEY, JSON.stringify(state.items));
    }
  }, [state.items, token]);

  // On login → sync local cart to MongoDB then load server cart
  useEffect(() => {
    if (!token) return;
    const guestItems = loadFromLS();

    const syncCart = async () => {
      try {
        const res = await fetch(`${API}/cart/sync`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body:    JSON.stringify({ items: guestItems }),
        });
        if (res.ok) {
          const data = await res.json();
          dispatch({ type: 'SET_ITEMS', payload: data.items });
          localStorage.removeItem(LS_KEY);
        }
      } catch (err) {
        console.error('Cart sync failed:', err);
      }
    };
    syncCart();
  }, [token]); // eslint-disable-line

  // ─── Actions ───────────────────────────────────────────────────────────────

  /**
   * addItem — adds to local state optimistically.
   * If user is logged in, also calls POST /api/cart/add (with stock check).
   * Returns { ok, message, available } so the caller can show a toast.
   */
  const addItem = useCallback(async (product, variant = null, qty = 1) => {
    const item = {
      productId:   product.productId,
      variantSku:  variant?.sku   ?? null,
      variantName: variant?.name  ?? null,
      name:        product.name,
      image:       variant?.imageURL ? `/images/${variant.imageURL}` : `/images/${product.image}`,
      priceAtAdd:  product.price,
      qty,
    };

    if (token) {
      // Logged in — let server validate stock
      try {
        const res = await fetch(`${API}/cart/add`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body:    JSON.stringify(item),
        });
        const data = await res.json();
        if (!res.ok) return { ok: false, message: data.message, available: data.available };
        dispatch({ type: 'SET_ITEMS', payload: data.items });
        return { ok: true };
      } catch {
        return { ok: false, message: 'Network error' };
      }
    } else {
      // Guest — optimistic local update (no server stock check in guest mode)
      dispatch({ type: 'ADD_ITEM', payload: { item } });
      return { ok: true };
    }
  }, [token]);

  const removeItem = useCallback(async (productId, variantSku = null) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, variantSku } });
    if (token) {
      try {
        await fetch(`${API}/cart/remove/${productId}?variantSku=${variantSku ?? ''}`, {
          method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
        });
      } catch { /* silent */ }
    }
  }, [token]);

  const updateQty = useCallback(async (productId, variantSku = null, qty) => {
    dispatch({ type: 'UPDATE_QTY', payload: { productId, variantSku, qty } });
    if (token) {
      try {
        await fetch(`${API}/cart/update`, {
          method:  'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body:    JSON.stringify({ productId, variantSku, qty }),
        });
      } catch { /* silent */ }
    }
  }, [token]);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR' });
    localStorage.removeItem(LS_KEY);
  }, []);

  const { lineItems, subtotal } = calculateTotal(state.items);
  const itemCount = state.items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{
      items: lineItems,
      rawItems: state.items,
      subtotal,
      itemCount,
      addItem,
      removeItem,
      updateQty,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
};

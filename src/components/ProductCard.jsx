import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { name, category, price, image, variants } = product;

  const [selectedVariant, setSelectedVariant] = useState(variants ? variants[0] : null);
  const [adding, setAdding]                   = useState(false);
  const [toast, setToast]                     = useState(null);  // { ok, msg }

  const displayImage = selectedVariant?.image || image;

  const handleAddToCart = async (e) => {
    e.preventDefault(); // don't navigate to PDP
    e.stopPropagation();
    setAdding(true);
    const result = await addItem(product, selectedVariant, 1);
    setAdding(false);
    setToast({ ok: result.ok, msg: result.ok ? 'Added to cart!' : result.message });
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <Link to={`/product/${product.productId}`} className="block group">
      <div className="product-card h-full flex flex-col">

        {/* Image */}
        <div className="relative overflow-hidden bg-parchment aspect-square">
          <img
            src={displayImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { e.target.style.display='none'; }}
          />
          {/* Quick-view overlay */}
          <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-all duration-300
                          flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="flex items-center gap-1 px-3 py-1.5 bg-white/90 rounded-full text-xs font-medium text-ink shadow-sm">
              <Eye size={13} /> Quick View
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1 gap-3">
          <div>
            <span className="text-xs font-medium text-gold uppercase tracking-wide">{category}</span>
            <h3 className="font-serif text-base font-semibold text-gray-800 mt-0.5 leading-snug line-clamp-2">
              {name}
            </h3>
            <p className="text-ink font-semibold text-base mt-1">₹{price.toFixed(2)}</p>
          </div>

          {/* Variant Swatches */}
          {variants && variants.length > 0 && (
            <div className="flex items-center gap-1.5">
              {variants.map(v => (
                <button
                  key={v.sku || v.name}
                  onClick={e => { e.preventDefault(); e.stopPropagation(); setSelectedVariant(v); }}
                  title={v.name}
                  className={`swatch ${selectedVariant?.name === v.name ? 'active' : ''}`}
                  style={{ backgroundColor: v.colorCode }}
                />
              ))}
              <span className="text-xs text-slate ml-1">{selectedVariant?.name}</span>
            </div>
          )}

          {/* Add to Cart */}
          <div className="mt-auto relative">
            <button
              id={`add-cart-${product.productId}`}
              onClick={handleAddToCart}
              disabled={adding}
              className="btn-primary w-full justify-center text-sm py-2"
            >
              {adding
                ? <span className="inline-block w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                : <ShoppingCart size={15} />
              }
              {adding ? 'Adding…' : 'Add to Cart'}
            </button>

            {/* Toast */}
            {toast && (
              <div className={`absolute -top-9 left-0 right-0 text-center text-xs font-medium py-1.5 rounded-lg
                              animate-slide-up
                              ${toast.ok ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                {toast.msg}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Minus, Plus, Loader2, AlertCircle, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const API = 'http://localhost:5000/api';
const resolveImage = (filename) => `/images/${filename}`;

export default function ProductDetail() {
  const { id }           = useParams();
  const { addItem }      = useCart();
  const navigate         = useNavigate();

  const [product, setProduct]             = useState(null);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty]                     = useState(1);
  const [adding, setAdding]               = useState(false);
  const [toast, setToast]                 = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res  = await fetch(`${API}/inventory/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        const normalised = {
          ...data,
          id:    data.productId,
          image: resolveImage(data.image),
          variants: data.variants?.length
            ? data.variants.map(v => ({ ...v, image: resolveImage(v.imageURL || data.image) }))
            : null,
        };
        setProduct(normalised);
        setSelectedVariant(normalised.variants?.[0] ?? null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    const result = await addItem(product, selectedVariant, qty);
    setAdding(false);
    setToast({ ok: result.ok, msg: result.ok ? 'Added to cart!' : result.message });
    setTimeout(() => setToast(null), 3000);
  };

  const isBulkDiscount = qty > 10;
  const displayImage   = selectedVariant?.image || product?.image;
  const stockLevel     = selectedVariant?.stock ?? product?.stock ?? 0;

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] gap-3 text-slate">
      <Loader2 size={32} className="animate-spin text-ink" /> Loading product…
    </div>
  );

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !product) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <AlertCircle size={40} className="text-danger" />
      <p className="text-danger font-medium">{error ?? 'Product not found'}</p>
      <Link to="/" className="btn-secondary">Back to Catalog</Link>
    </div>
  );

  return (
    <div className="page-container py-8 animate-fade-in">

      {/* Back link */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-ink
                               mb-6 transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* ── Image Panel ──────────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Hero image */}
          <div className="aspect-square rounded-2xl overflow-hidden bg-parchment shadow-card">
            <img
              src={displayImage}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-500"
            />
          </div>

          {/* Variant thumbnails */}
          {product.variants && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.variants.map(v => (
                <button
                  key={v.sku || v.name}
                  onClick={() => setSelectedVariant(v)}
                  className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all
                              ${selectedVariant?.name === v.name
                                ? 'border-ink shadow-md scale-105'
                                : 'border-transparent hover:border-gray-300'}`}
                  title={v.name}
                >
                  <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Info Panel ───────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">

          <div>
            <span className="badge bg-gold/10 text-gold uppercase tracking-wide text-xs">
              {product.category}
            </span>
            <h1 className="font-serif text-3xl font-bold text-gray-800 mt-2 leading-tight">
              {product.name}
            </h1>
            {product.description && (
              <p className="text-slate mt-3 leading-relaxed">{product.description}</p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-ink">₹{product.price.toFixed(2)}</span>
            {isBulkDiscount && (
              <span className="badge-discount flex items-center gap-1">
                <Tag size={12} /> 20% bulk discount applied
              </span>
            )}
          </div>

          {/* Stock indicator */}
          <div>
            {stockLevel === 0 ? (
              <span className="badge-low-stock">Out of Stock</span>
            ) : stockLevel < 10 ? (
              <span className="badge-low-stock">Only {stockLevel} left</span>
            ) : (
              <span className="badge-in-stock">In Stock</span>
            )}
          </div>

          {/* Color Swatches */}
          {product.variants && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Variant: <strong>{selectedVariant?.name}</strong>
              </p>
              <div className="flex gap-3 flex-wrap">
                {product.variants.map(v => (
                  <button
                    key={v.sku || v.name}
                    onClick={() => setSelectedVariant(v)}
                    title={v.name}
                    className={`swatch w-9 h-9 ${selectedVariant?.name === v.name ? 'active' : ''}`}
                    style={{ backgroundColor: v.colorCode }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Quantity</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="px-3 py-2 text-slate hover:bg-parchment hover:text-ink transition-colors"
                  disabled={qty <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-semibold text-gray-800">{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="px-3 py-2 text-slate hover:bg-parchment hover:text-ink transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              {isBulkDiscount && (
                <span className="text-sm text-warning font-medium">
                  Bulk price: ₹{(product.price * qty * 0.8).toFixed(2)}
                  <span className="text-slate font-normal ml-1">(was ₹{(product.price * qty).toFixed(2)})</span>
                </span>
              )}
            </div>

            {qty > 10 && (
              <p className="text-xs text-warning mt-1.5">
                🎉 Orders over 10 units get 20% off!
              </p>
            )}
          </div>

          {/* Add to Cart Button */}
          <div className="space-y-3">
            <button
              id={`pdp-add-cart-${product.productId}`}
              onClick={handleAddToCart}
              disabled={adding || stockLevel === 0}
              className="btn-primary w-full justify-center text-base py-3"
            >
              {adding
                ? <span className="w-5 h-5 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                : <ShoppingCart size={20} />
              }
              {adding ? 'Adding to Cart…' : stockLevel === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            <button
              onClick={() => { handleAddToCart().then(() => navigate('/checkout')); }}
              disabled={adding || stockLevel === 0}
              className="btn-secondary w-full justify-center text-base py-3"
            >
              Buy Now
            </button>

            {/* Toast */}
            {toast && (
              <div className={`text-center text-sm py-2 rounded-lg font-medium animate-slide-up
                              ${toast.ok ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                {toast.msg}
              </div>
            )}
          </div>

          {/* Product ID */}
          <p className="text-xs text-slate">SKU: {product.productId}</p>
        </div>
      </div>
    </div>
  );
}

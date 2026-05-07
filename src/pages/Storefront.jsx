import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import CategoryBar from '../components/CategoryBar.jsx';
import ProductCard from '../components/ProductCard.jsx';

const API = 'http://localhost:5000/api';

// Image resolution helper (same logic as before)
const resolveImage = (filename) => `/images/${filename}`;

// Attach /images/ prefix to variant imageURL if present, else fall back
const normaliseProduct = (p) => ({
  ...p,
  id:    p.productId,
  image: resolveImage(p.image),
  variants: p.variants?.length
    ? p.variants.map(v => ({
        ...v,
        image: resolveImage(v.imageURL || p.image),
      }))
    : null,
});

export default function Storefront() {
  const [searchParams]                      = useSearchParams();
  const [products, setProducts]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All Products');

  // Read search query from URL (?q=...)
  const urlQuery = searchParams.get('q') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (urlQuery)              params.set('q', urlQuery);
      if (selectedCategory !== 'All Products') params.set('category', selectedCategory);

      const res = await fetch(`${API}/inventory?${params}`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setProducts(data.map(normaliseProduct));
    } catch (err) {
      console.error(err);
      setError('Could not load products. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  }, [urlQuery, selectedCategory]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <div className="animate-fade-in">
      {/* Category bar */}
      <CategoryBar selected={selectedCategory} onChange={setSelectedCategory} />

      <main className="page-container py-8">

        {/* Section header */}
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-ink">
              {urlQuery
                ? <>Results for <span className="text-gold italic">"{urlQuery}"</span></>
                : selectedCategory === 'All Products' ? 'Our Catalog' : selectedCategory
              }
            </h1>
            {!loading && !error && (
              <p className="text-slate text-sm mt-0.5">
                {products.length} item{products.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>

          {urlQuery && (
            <a href="/" className="text-sm text-ink hover:text-inkLight underline underline-offset-2">
              Clear search
            </a>
          )}
        </div>

        {/* States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate">
            <Loader2 size={40} className="animate-spin text-ink" />
            <p>Loading catalog from database…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-danger">
            <AlertCircle size={40} />
            <p className="text-center max-w-sm">{error}</p>
            <button onClick={fetchProducts} className="btn-secondary flex items-center gap-2">
              <RefreshCw size={16} /> Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate">
            <p className="text-lg font-serif">No products match your search.</p>
            <a href="/" className="btn-primary">Browse all products</a>
          </div>
        ) : (
          <div className="product-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

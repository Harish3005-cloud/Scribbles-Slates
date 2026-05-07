import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, LogOut, Feather, Loader2, AlertCircle } from 'lucide-react';
import SidebarFilter from './SidebarFilter.jsx';
import ProductCard from './ProductCard.jsx';
import CartDrawer from './CartDrawer.jsx';

// ─── Hero Image Map ────────────────────────────────────────────────────────────
// Maps the filename stored in MongoDB → the public/ URL served by Vite.
// To add a new product: drop its image in public/images/ and add an entry here.
// ─────────────────────────────────────────────────────────────────────────────
const imageMap = {
  'Fountain-pen(OnyxBlack).webp':  '/images/Fountain-pen(OnyxBlack).webp',
  'Fountain-pen(NavyBlue).webp':   '/images/Fountain-pen(NavyBlue).webp',
  'Fountain-pen(crimsomwebp.webp': '/images/Fountain-pen(crimsomwebp.webp',
  'Midnight-Ink.webp':             '/images/Midnight-Ink.webp',
  'journal(Tanleather).webp':      '/images/journal(Tanleather).webp',
  'journal(DarkBrown).webp':       '/images/journal(DarkBrown).webp',
  'calligraphy_kit.webp':          '/images/calligraphy_kit.webp',
  'Golden_nib(Broad).webp':        '/images/Golden_nib(Broad).webp',
  'Golden_nib(Medium).webp':       '/images/Golden_nib(Medium).webp',
  'Golden_nib(Fine).webp':         '/images/Golden_nib(Fine).webp',
  'Linen_sheets.jpg':              '/images/Linen_sheets.jpg',
};

// ─── Per-Variant Image Map ─────────────────────────────────────────────────────
// Key format: "productId:variantName"  →  filename in public/images/
// Add entries here when new products with colour variants are added.
// ─────────────────────────────────────────────────────────────────────────────
const variantImageMap = {
  'FP-001:Onyx Black':  'Fountain-pen(OnyxBlack).webp',
  'FP-001:Navy Blue':   'Fountain-pen(NavyBlue).webp',
  'FP-001:Crimson':     'Fountain-pen(crimsomwebp.webp',
  'NP-001:Tan Leather': 'journal(Tanleather).webp',
  'NP-001:Dark Brown':  'journal(DarkBrown).webp',
  'ACC-001:Fine':       'Golden_nib(Fine).webp',
  'ACC-001:Medium':     'Golden_nib(Medium).webp',
  'ACC-001:Broad':      'Golden_nib(Broad).webp',
};

// Resolves a filename → /images/<file> URL, with a safe fallback.
const resolveImage = (filename) => imageMap[filename] ?? `/images/${filename}`;

const Dashboard = ({ onLogout }) => {
  const [products, setProducts]                 = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [error, setError]                       = useState(null);
  const [searchQuery, setSearchQuery]           = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [isCartOpen, setIsCartOpen]             = useState(false);
  const [cartItems, setCartItems]               = useState([]);

  // ─── Fetch inventory from the Express API on mount ───────────────────────
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('http://localhost:5000/api/inventory');
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const data = await res.json();

        // Normalise: resolve image filenames → URLs and attach variant images
        const normalised = data.map(product => ({
          ...product,
          id:    product.productId,
          image: resolveImage(product.image),
          variants: product.variants?.length
            ? product.variants.map(v => ({
                ...v,
                // Look up the explicit variant image; fall back to the product hero image
                image: resolveImage(
                  variantImageMap[`${product.productId}:${v.name}`] ?? product.image
                ),
              }))
            : null,
        }));

        setProducts(normalised);
      } catch (err) {
        console.error('Failed to load inventory:', err);
        setError('Could not load products. Please make sure the server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // ─── Filter Logic (unchanged) ─────────────────────────────────────────────
  const filteredProducts = products.filter(product => {
    const matchesSearch   = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Products' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product) => {
    setCartItems([...cartItems, product]);
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (indexToRemove) => {
    setCartItems(cartItems.filter((_, idx) => idx !== indexToRemove));
  };

  // ─── Loading State ────────────────────────────────────────────────────────
  const LoadingState = () => (
    <div className="inventory-status-container">
      <Loader2 size={40} className="spin-icon" />
      <p>Loading catalog from database…</p>
    </div>
  );

  // ─── Error State ──────────────────────────────────────────────────────────
  const ErrorState = () => (
    <div className="inventory-status-container error">
      <AlertCircle size={40} />
      <p>{error}</p>
      <button
        className="btn btn-secondary"
        style={{ marginTop: '1rem', padding: '0.6rem 1.4rem', borderRadius: '0.75rem' }}
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="dashboard-layout fade-in">
      {/* Navbar */}
      <header className="dashboard-header">
        <div className="header-left">
          <Menu className="mobile-menu-btn" size={24} />
          <div className="brand-logo font-serif">
            <Feather size={20} className="brand-icon" />
            <span>Scribbles &amp; Slates</span>
          </div>
        </div>

        <div className="header-right">
          <button className="cart-toggle-btn" onClick={() => setIsCartOpen(true)}>
            <ShoppingBag size={20} />
            {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
          </button>

          <button className="logout-btn" onClick={onLogout} title="Back to Landing">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* Search & Filter Module */}
        <SidebarFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Inventory Dashboard */}
        <section className="inventory-section">
          <div className="inventory-header">
            <h2 className="font-serif text-2xl text-ink">Catalog</h2>
            {!loading && !error && (
              <p className="text-slate">
                {filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>

          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState />
          ) : (
            <div className="product-grid">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
              {filteredProducts.length === 0 && (
                <div className="no-products-found">
                  <p>No products match your search or filter criteria.</p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('All Products'); }}
                    className="btn btn-secondary mt-4"
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem' }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Persistent Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        removeFromCart={handleRemoveFromCart}
      />
    </div>
  );
};

export default Dashboard;

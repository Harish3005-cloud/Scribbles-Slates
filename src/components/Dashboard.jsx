import React, { useState } from 'react';
import { ShoppingBag, Menu, LogOut, Feather } from 'lucide-react';
import SidebarFilter from './SidebarFilter.jsx';
import ProductCard from './ProductCard.jsx';
import CartDrawer from './CartDrawer.jsx';
import penOnyxBlack from '../assets/Fountain_Pens/Fountain-pen(OnyxBlack).webp';
import penNavyBlue from '../assets/Fountain_Pens/Fountain-pen(NavyBlue).webp';
import penCrimson from '../assets/Fountain_Pens/Fountain-pen(crimsomwebp.webp';
import inkMidnight from '../assets/Inks/Midnight-Ink.webp';
import journalTan from '../assets/NotesBooks&Paper/journal(Tanleather).webp';
import journalBrown from '../assets/NotesBooks&Paper/journal(DarkBrown).webp';
import calligraphySet from '../assets/Calligraphy_sets/calligraphy_kit.webp';
import nibBroad from '../assets/Accessories/Golden_nib(Broad).webp';
import nibMedium from '../assets/Accessories/Golden_nib(Medium).webp';
import nibFine from '../assets/Accessories/Golden_nib(Fine).webp';
import paperLinen from '../assets/Accessories/Linen_sheets.jpg';

// Dummy Data
const dummyProducts = [
  {
    id: 1,
    name: "Classic Fountain Pen",
    category: "Fountain Pens",
    price: 120.00,
    image: penOnyxBlack,
    variants: [
      { name: 'Onyx Black', colorCode: '#000000', image: penOnyxBlack },
      { name: 'Navy Blue', colorCode: '#1e3a8a', image: penNavyBlue },
      { name: 'Crimson', colorCode: '#7f1d1d', image: penCrimson }
    ]
  },
  {
    id: 2,
    name: "Midnight Ink 50ml",
    category: "Inks",
    price: 24.50,
    image: inkMidnight,
    variants: null
  },
  {
    id: 3,
    name: "Artisan Leather Journal",
    category: "Notebooks & Paper",
    price: 45.00,
    image: journalTan,
    variants: [
      { name: 'Tan Leather', colorCode: '#d97706', image: journalTan },
      { name: 'Dark Brown', colorCode: '#451a03', image: journalBrown }
    ]
  },
  {
    id: 4,
    name: "Calligraphy Starter Set",
    category: "Calligraphy Sets",
    price: 85.00,
    image: calligraphySet,
    variants: null
  },
  {
    id: 5,
    name: "Gold Nib Replacement",
    category: "Accessories",
    price: 150.00,
    image: nibMedium,
    variants: [
      { name: 'Fine', colorCode: '#fcd34d', image: nibFine },
      { name: 'Medium', colorCode: '#fbbf24', image: nibMedium },
      { name: 'Broad', colorCode: '#f59e0b', image: nibBroad }
    ]
  },
  {
    id: 6,
    name: "Premium Linen Paper 100 Sheets",
    category: "Notebooks & Paper",
    price: 35.00,
    image: paperLinen,
    variants: null
  }
];

const Dashboard = ({ onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Filtering Logic
  const filteredProducts = dummyProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Products" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product) => {
    setCartItems([...cartItems, product]);
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (indexToRemove) => {
    setCartItems(cartItems.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="dashboard-layout fade-in">
      {/* Navbar */}
      <header className="dashboard-header">
        <div className="header-left">
          <Menu className="mobile-menu-btn" size={24} />
          <div className="brand-logo font-serif">
            <Feather size={20} className="brand-icon" />
            <span>Scribbles & Slates</span>
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
            <p className="text-slate">{filteredProducts.length} items found</p>
          </div>

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
                <button onClick={() => { setSearchQuery(''); setSelectedCategory('All Products'); }} className="btn btn-secondary mt-4" style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem' }}>
                  Clear Filters
                </button>
              </div>
            )}
          </div>
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

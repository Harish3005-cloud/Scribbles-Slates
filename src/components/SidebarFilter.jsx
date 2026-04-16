import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const SidebarFilter = ({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }) => {
  const categories = ["All Products", "Fountain Pens", "Calligraphy Sets", "Inks", "Notebooks & Paper", "Accessories"];

  return (
    <aside className="sidebar-filter">
      <div className="filter-header">
        <SlidersHorizontal size={20} className="filter-icon" />
        <h2 className="font-serif">Filters & Search</h2>
      </div>

      <div className="search-box">
        <Search size={16} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search catalog..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filter-section">
        <h3>Categories</h3>
        <ul className="category-list">
          {categories.map((cat) => (
            <li key={cat}>
              <button 
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-section mt-4">
        <h3>Price Range</h3>
        <input type="range" min="0" max="500" className="price-slider" />
        <div className="price-labels">
          <span>$0</span>
          <span>$500+</span>
        </div>
      </div>
    </aside>
  );
};

export default SidebarFilter;

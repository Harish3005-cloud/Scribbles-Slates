import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  'All Products',
  'Fountain Pens',
  'Calligraphy Sets',
  'Inks',
  'Notebooks & Paper',
  'Accessories',
];

export default function CategoryBar({ selected, onChange }) {
  return (
    <div className="w-full overflow-x-auto border-b border-gray-200 bg-white">
      <div className="page-container">
        <div className="flex items-center gap-2 py-3 w-max min-w-full">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              id={`cat-${cat.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
              onClick={() => onChange(cat)}
              className={`cat-pill ${selected === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, onAddToCart }) => {
  const { name, category, price, image, variants } = product;
  const [selectedVariant, setSelectedVariant] = useState(variants ? variants[0] : null);

  return (
    <div className="product-card">
      <div className="product-image-container">
        {/* Placeholder for the product image, using generic gray box or generic illustration icon */}
        <div className="image-placeholder">
          <img src={selectedVariant?.image || image} alt={name} className="product-image" />
        </div>
      </div>
      
      <div className="product-info">
        <span className="product-category">{category}</span>
        <h3 className="product-title font-serif">{name}</h3>
        <p className="product-price">${price.toFixed(2)}</p>

        {variants && variants.length > 0 && (
          <div className="variant-selector">
            <span className="variant-label">Variant: <strong>{selectedVariant.name}</strong></span>
            <div className="variant-options">
              {variants.map(variant => (
                <button 
                  key={variant.name}
                  onClick={() => setSelectedVariant(variant)}
                  className={`variant-dot ${selectedVariant.name === variant.name ? 'active' : ''}`}
                  style={{ backgroundColor: variant.colorCode }}
                  title={variant.name}
                />
              ))}
            </div>
          </div>
        )}

        <button 
          className="add-to-cart-btn"
          onClick={() => onAddToCart({ ...product, variant: selectedVariant })}
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

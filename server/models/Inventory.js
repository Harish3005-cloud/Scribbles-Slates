const mongoose = require('mongoose');

// Schema for individual product variants (e.g. colour options for a pen)
const variantSchema = new mongoose.Schema({
  sku:       { type: String, required: true },          // e.g. "FP-001-BLK"
  name:      { type: String, required: true },          // e.g. "Onyx Black"
  colorCode: { type: String, required: true },          // e.g. "#000000"
  stock:     { type: Number, required: true, min: 0, default: 0 },
  imageURL:  { type: String, default: '' },             // explicit image filename
}, { _id: false });

const inventorySchema = new mongoose.Schema({
  productId: {
    type:     String,
    required: true,
    unique:   true,   // e.g. "FP-001", "INK-001"
    trim:     true,
  },
  name: {
    type:     String,
    required: true,
    trim:     true,
  },
  category: {
    type:     String,
    required: true,
    trim:     true,
    // Allowed categories kept consistent with the SidebarFilter options
    enum: ['Fountain Pens', 'Inks', 'Notebooks & Paper', 'Calligraphy Sets', 'Accessories'],
  },
  price: {
    type:     Number,
    required: true,
    min:      0,
  },
  description: {
    type:    String,
    default: '',
    trim:    true,
  },
  // Filename of the image inside /public/images/  e.g. "Midnight-Ink.webp"
  // The frontend resolves the full URL as  /images/<image>
  image: {
    type:     String,
    required: true,
    trim:     true,
  },
  // Optional array of colour/style variants; null / empty means no variants
  variants: {
    type:    [variantSchema],
    default: [],
  },
  // Aggregate stock across all variants.
  // For products WITH variants this is the sum of variant.stock values.
  // For products WITHOUT variants this is the standalone stock count.
  stock: {
    type:     Number,
    required: true,
    min:      0,
    default:  0,
  },
}, {
  timestamps: true,               // adds createdAt / updatedAt automatically
  collection:  'inventory',       // explicit collection name in the 'test' db
});

module.exports = mongoose.model('Inventory', inventorySchema);

const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId:   { type: String, required: true },   // e.g. "FP-001"
  variantSku:  { type: String, default: null },    // e.g. "FP-001-BLK" or null
  variantName: { type: String, default: null },    // e.g. "Onyx Black" or null
  name:        { type: String, required: true },   // product name snapshot
  image:       { type: String, required: true },   // image URL snapshot
  priceAtAdd:  { type: Number, required: true },   // price locked at time of add
  qty:         { type: Number, required: true, min: 1, default: 1 },
}, { _id: false });

const cartSchema = new mongoose.Schema({
  userId: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
    unique:   true,    // one cart per user
  },
  items: {
    type:    [cartItemSchema],
    default: [],
  },
}, {
  timestamps: true,
  collection: 'carts',
});

module.exports = mongoose.model('Cart', cartSchema);

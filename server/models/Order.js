const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId:   { type: String, required: true },
  variantSku:  { type: String, default: null },
  variantName: { type: String, default: null },
  name:        { type: String, required: true },
  image:       { type: String, required: true },
  priceAtOrder:{ type: Number, required: true },
  qty:         { type: Number, required: true },
  lineTotal:   { type: Number, required: true },  // priceAtOrder * qty (after discount)
  discountApplied: { type: Boolean, default: false },
}, { _id: false });

const addressSchema = new mongoose.Schema({
  fullName:   { type: String, required: true },
  line1:      { type: String, required: true },
  line2:      { type: String, default: '' },
  city:       { type: String, required: true },
  state:      { type: String, required: true },
  pincode:    { type: String, required: true },
  phone:      { type: String, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'User',
    required: true,
  },
  items:           { type: [orderItemSchema], required: true },
  shippingAddress: { type: addressSchema, required: true },
  subtotal:        { type: Number, required: true },
  totalAmount:     { type: Number, required: true },
  status: {
    type:    String,
    enum:    ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  // Razorpay fields
  razorpayOrderId:   { type: String, default: null },
  razorpayPaymentId: { type: String, default: null },
  razorpaySignature: { type: String, default: null },
  paidAt:            { type: Date, default: null },
}, {
  timestamps: true,
  collection: 'orders',
});

module.exports = mongoose.model('Order', orderSchema);

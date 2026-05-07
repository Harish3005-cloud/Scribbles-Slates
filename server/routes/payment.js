const express            = require('express');
const router             = express.Router();
const Razorpay           = require('razorpay');
const crypto             = require('crypto');
const { protect }        = require('../middleware/auth');
const Cart               = require('../models/Cart');
const Order              = require('../models/Order');
const Inventory          = require('../models/Inventory');
const { checkStock }     = require('../middleware/stockCheck');
const { calculateTotal } = require('../utils/pricing');

// Initialise Razorpay instance (uses test keys from .env)
const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/payment/create-order
// @desc    Create a Razorpay order and a pending Order doc in MongoDB
// @body    { shippingAddress: { fullName, line1, line2, city, state, pincode, phone } }
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
router.post('/create-order', protect, async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    // 1. Load cart
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // 2. Final stock check
    for (const item of cart.items) {
      const result = await checkStock(item.productId, item.variantSku, item.qty);
      if (!result.ok) {
        return res.status(409).json({ message: result.message, available: result.available });
      }
    }

    // 3. Calculate total (with bulk discount)
    const { lineItems, subtotal } = calculateTotal(cart.items);

    // 4. Create Razorpay order (amount in paise = subtotal * 100)
    const rpOrder = await razorpay.orders.create({
      amount:   Math.round(subtotal * 100),
      currency: 'INR',
      receipt:  `ss_${Date.now()}`,
    });

    // 5. Create pending Order in MongoDB
    const order = await Order.create({
      userId: req.user._id,
      items:  lineItems.map(li => ({
        productId:      li.productId,
        variantSku:     li.variantSku,
        variantName:    li.variantName,
        name:           li.name,
        image:          li.image,
        priceAtOrder:   li.priceAtAdd,
        qty:            li.qty,
        lineTotal:      li.lineTotal,
        discountApplied: li.discountApplied,
      })),
      shippingAddress,
      subtotal,
      totalAmount:     subtotal,
      razorpayOrderId: rpOrder.id,
      status:          'pending',
    });

    res.json({
      orderId:        order._id,
      razorpayOrderId: rpOrder.id,
      amount:         rpOrder.amount,
      currency:       rpOrder.currency,
      keyId:          process.env.RAZORPAY_KEY_ID,
      prefill: {
        name:  req.user.name,
        email: req.user.email,
      },
    });
  } catch (err) {
    console.error('Payment create-order error:', err);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/payment/verify
// @desc    Verify Razorpay payment signature, mark order paid, deduct stock
// @body    { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
router.post('/verify', protect, async (req, res) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    // 1. Verify HMAC signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Payment verification failed — invalid signature' });
    }

    // 2. Update order status
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        status:            'paid',
        razorpayPaymentId,
        razorpaySignature,
        paidAt:            new Date(),
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // 3. Deduct stock for each item
    for (const item of order.items) {
      if (item.variantSku) {
        // Variant product — decrement variant.stock
        await Inventory.updateOne(
          { productId: item.productId, 'variants.sku': item.variantSku },
          {
            $inc: {
              'variants.$.stock': -item.qty,
              stock:              -item.qty,
            },
          }
        );
      } else {
        // Simple product
        await Inventory.updateOne(
          { productId: item.productId },
          { $inc: { stock: -item.qty } }
        );
      }
    }

    // 4. Clear the user's cart
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items: [] }
    );

    res.json({ message: 'Payment verified successfully', orderId: order._id });
  } catch (err) {
    console.error('Payment verify error:', err);
    res.status(500).json({ message: 'Payment verification failed' });
  }
});

module.exports = router;

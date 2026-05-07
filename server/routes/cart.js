const express            = require('express');
const router             = express.Router();
const Cart               = require('../models/Cart');
const { protect }        = require('../middleware/auth');
const { stockCheckMiddleware, checkStock } = require('../middleware/stockCheck');
const { calculateTotal } = require('../utils/pricing');

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/cart
// @desc    Get the logged-in user's cart
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) cart = { items: [] };
    const { lineItems, subtotal } = calculateTotal(cart.items);
    res.json({ items: lineItems, subtotal });
  } catch (err) {
    console.error('Cart fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/cart/sync
// @desc    Merge a guest LocalStorage cart into the user's MongoDB cart on login
// @body    { items: CartItem[] }
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
router.post('/sync', protect, async (req, res) => {
  try {
    const { items: guestItems = [] } = req.body;

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    // Ensure we only process valid items
    const validGuestItems = guestItems.filter(i => 
      typeof i.priceAtAdd === 'number' && 
      !Number.isNaN(i.priceAtAdd) && 
      typeof i.name === 'string' && 
      i.name.trim() !== '' && 
      typeof i.productId === 'string' && 
      i.productId.trim() !== ''
    );

    // Merge strategy: for each guest item, upsert into the DB cart
    for (const gItem of validGuestItems) {
      const existing = cart.items.find(
        i => i.productId === gItem.productId && i.variantSku === gItem.variantSku
      );
      if (existing) {
        existing.qty += gItem.qty;  // accumulate qty
      } else {
        cart.items.push(gItem);
      }
    }

    await cart.save();
    const { lineItems, subtotal } = calculateTotal(cart.items);
    res.json({ items: lineItems, subtotal });
  } catch (err) {
    console.error('Cart sync error (purging invalid frontend cache):', err);
    // CRITICAL: We return 200 instead of 500 so the frontend sees res.ok = true
    // This allows the frontend to execute localStorage.removeItem() and break out of the infinite sync loop!
    const fallbackCart = await Cart.findOne({ userId: req.user._id });
    const { lineItems, subtotal } = calculateTotal(fallbackCart ? fallbackCart.items : []);
    res.status(200).json({ items: lineItems, subtotal });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/cart/add
// @desc    Add or increment an item in the cart (with stock check)
// @body    { productId, variantSku, variantName, name, image, priceAtAdd, qty }
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
router.post('/add', protect, stockCheckMiddleware, async (req, res) => {
  try {
    const { productId, variantSku = null, variantName = null, name, image, priceAtAdd, qty = 1 } = req.body;

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) cart = new Cart({ userId: req.user._id, items: [] });

    const existing = cart.items.find(
      i => i.productId === productId && i.variantSku === variantSku
    );

    if (existing) {
      existing.qty += qty;
    } else {
      cart.items.push({ productId, variantSku, variantName, name, image, priceAtAdd, qty });
    }

    await cart.save();
    const { lineItems, subtotal } = calculateTotal(cart.items);
    res.json({ items: lineItems, subtotal });
  } catch (err) {
    console.error('Cart add error:', err);
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   PUT /api/cart/update
// @desc    Update qty for a specific item (removes if qty <= 0)
// @body    { productId, variantSku, qty }
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
router.put('/update', protect, async (req, res) => {
  try {
    const { productId, variantSku = null, qty } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    if (qty <= 0) {
      cart.items = cart.items.filter(
        i => !(i.productId === productId && i.variantSku === variantSku)
      );
    } else {
      const item = cart.items.find(
        i => i.productId === productId && i.variantSku === variantSku
      );
      if (item) item.qty = qty;
    }

    await cart.save();
    const { lineItems, subtotal } = calculateTotal(cart.items);
    res.json({ items: lineItems, subtotal });
  } catch (err) {
    console.error('Cart update error:', err);
    res.status(500).json({ message: 'Failed to update cart' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   DELETE /api/cart/remove/:productId
// @desc    Remove a specific item from cart
// @query   ?variantSku=FP-001-BLK  (optional)
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;
    const variantSku = req.query.variantSku || null;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(
      i => !(i.productId === productId && i.variantSku === variantSku)
    );

    await cart.save();
    const { lineItems, subtotal } = calculateTotal(cart.items);
    res.json({ items: lineItems, subtotal });
  } catch (err) {
    console.error('Cart remove error:', err);
    res.status(500).json({ message: 'Failed to remove item' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/cart/checkout/initiate
// @desc    Validate ALL cart items have sufficient stock before checkout
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
router.post('/checkout/initiate', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    const stockErrors = [];

    for (const item of cart.items) {
      const result = await checkStock(item.productId, item.variantSku, item.qty);
      if (!result.ok) {
        stockErrors.push({ productId: item.productId, variantSku: item.variantSku, message: result.message, available: result.available });
      }
    }

    if (stockErrors.length > 0) {
      return res.status(409).json({
        message: 'Some items in your cart are out of stock or have insufficient quantity',
        errors:  stockErrors,
      });
    }

    const { lineItems, subtotal } = calculateTotal(cart.items);
    res.json({ ok: true, items: lineItems, subtotal });
  } catch (err) {
    console.error('Checkout initiate error:', err);
    res.status(500).json({ message: 'Checkout validation failed' });
  }
});

module.exports = router;

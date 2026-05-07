const express   = require('express');
const router    = express.Router();
const multer    = require('multer');
const path      = require('path');
const fs        = require('fs');
const Inventory = require('../models/Inventory');
const { protect, requireAdmin } = require('../middleware/auth');

// ─────────────────────────────────────────────────────────────────────────────
// Multer Configuration for File Uploads
// ─────────────────────────────────────────────────────────────────────────────
const uploadDir = path.join(__dirname, '../../public/images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `product-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/inventory
// @desc    Fetch all products (optionally filtered by tokenized search query)
// @access  Public
// @query   ?q=saffron+leather  (space or + separated tokens, all must match)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    let filter = {};

    if (req.query.q && req.query.q.trim()) {
      // Tokenize: split on whitespace and/or '+', remove empty strings
      const tokens = req.query.q.trim().split(/[\s+]+/).filter(Boolean);

      // Each token must match in EITHER name OR category (case-insensitive)
      // Using $and across all tokens → "Saffron Leather" = must have both tokens
      filter.$and = tokens.map(token => ({
        $or: [
          { name:     { $regex: token, $options: 'i' } },
          { category: { $regex: token, $options: 'i' } },
        ],
      }));
    }

    if (req.query.category && req.query.category !== 'All Products') {
      filter.category = req.query.category;
    }

    const products = await Inventory.find(filter).sort({ createdAt: 1 });
    res.status(200).json(products);
  } catch (error) {
    console.error('Inventory fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch inventory' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/inventory/:productId
// @desc    Fetch a single product by its productId (e.g. "FP-001")
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:productId', async (req, res) => {
  try {
    const product = await Inventory.findOne({ productId: req.params.productId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Inventory single fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/inventory
// @desc    Create a new product with an optional image upload
// @access  Admin Private
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', protect, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { productId, name, category, description, price, stock, variants } = req.body;
    
    // Check if productId exists
    const existing = await Inventory.findOne({ productId });
    if (existing) {
      return res.status(400).json({ message: 'Product ID already exists' });
    }

    const newProduct = new Inventory({
      productId,
      name,
      category,
      description,
      price: Number(price),
      stock: Number(stock),
      image: req.file ? req.file.filename : undefined,
      variants: variants ? JSON.parse(variants) : []
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ message: 'Failed to create product' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   PUT /api/inventory/:productId
// @desc    Update a product and optionally upload a new image
// @access  Admin Private
// ─────────────────────────────────────────────────────────────────────────────
router.put('/:productId', protect, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, category, description, price, stock, variants } = req.body;
    
    const product = await Inventory.findOne({ productId: req.params.productId });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.name = name || product.name;
    product.category = category || product.category;
    product.description = description !== undefined ? description : product.description;
    product.price = price !== undefined ? Number(price) : product.price;
    product.stock = stock !== undefined ? Number(stock) : product.stock;
    if (variants) product.variants = JSON.parse(variants);
    if (req.file) product.image = req.file.filename;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   DELETE /api/inventory/:productId
// @desc    Delete a product
// @access  Admin Private
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/:productId', protect, requireAdmin, async (req, res) => {
  try {
    const deleted = await Inventory.findOneAndDelete({ productId: req.params.productId });
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    
    // Delete associated image file
    if (deleted.image) {
      const imgPath = path.join(__dirname, '../../public/images', deleted.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

module.exports = router;

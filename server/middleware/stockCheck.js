const Inventory = require('../models/Inventory');

/**
 * checkStock  —  Validates that enough stock exists for a given item.
 *
 * For variant products:  checks variant.stock for the matching sku.
 * For non-variant products: checks the top-level stock field.
 *
 * @param {string} productId    e.g. "FP-001"
 * @param {string|null} variantSku  e.g. "FP-001-BLK" or null
 * @param {number} qty          quantity requested
 * @returns {{ ok: boolean, available: number, message: string }}
 */
const checkStock = async (productId, variantSku, qty) => {
  const product = await Inventory.findOne({ productId });

  if (!product) {
    return { ok: false, available: 0, message: `Product "${productId}" not found` };
  }

  // Variant product
  if (variantSku) {
    const variant = product.variants.find(v => v.sku === variantSku);
    if (!variant) {
      return { ok: false, available: 0, message: `Variant "${variantSku}" not found` };
    }
    if (variant.stock < qty) {
      return {
        ok:        false,
        available: variant.stock,
        message:   `Only ${variant.stock} unit(s) of "${product.name} — ${variant.name}" left in stock`,
      };
    }
    return { ok: true, available: variant.stock, message: 'In stock' };
  }

  // Simple product (no variants)
  if (product.stock < qty) {
    return {
      ok:        false,
      available: product.stock,
      message:   `Only ${product.stock} unit(s) of "${product.name}" left in stock`,
    };
  }
  return { ok: true, available: product.stock, message: 'In stock' };
};

/**
 * stockCheckMiddleware  —  Express middleware wrapper for use in cart routes.
 * Reads productId, variantSku, qty from req.body.
 */
const stockCheckMiddleware = async (req, res, next) => {
  const { productId, variantSku = null, qty = 1 } = req.body;

  try {
    const result = await checkStock(productId, variantSku, qty);
    if (!result.ok) {
      return res.status(409).json({ message: result.message, available: result.available });
    }
    req.stockResult = result;
    next();
  } catch (err) {
    console.error('Stock check error:', err);
    res.status(500).json({ message: 'Stock check failed' });
  }
};

module.exports = { checkStock, stockCheckMiddleware };

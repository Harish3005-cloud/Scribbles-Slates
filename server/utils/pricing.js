/**
 * calculateTotal  —  Shared pricing logic (also mirrored on the frontend).
 *
 * Rules:
 *   - If a line item's qty > 10 → apply 20% bulk discount to that line
 *   - All other lines → full price
 *
 * @param {Array<{ priceAtAdd: number, qty: number }>} items
 * @returns {{ lineItems: Array, subtotal: number }}
 */
const calculateTotal = (items = []) => {
  // Filter out any broken items that don't have prices or valid quantities
  const validItems = items.filter(i => i && typeof i.priceAtAdd === 'number' && !Number.isNaN(i.priceAtAdd) && i.qty > 0);

  const lineItems = validItems.map(item => {
    // Convert Mongoose doc to plain object to avoid circular JSON
    const plainItem = item.toObject ? item.toObject() : item;
    const discount = plainItem.qty > 10 ? 0.80 : 1.0;
    const lineTotal = parseFloat((plainItem.priceAtAdd * plainItem.qty * discount).toFixed(2));
    return {
      ...plainItem,
      discount:       plainItem.qty > 10 ? 20 : 0,   // percentage
      discountApplied: plainItem.qty > 10,
      lineTotal,
    };
  });

  const subtotal = parseFloat(
    lineItems.reduce((sum, li) => sum + li.lineTotal, 0).toFixed(2)
  );

  return { lineItems, subtotal };
};

module.exports = { calculateTotal };

#!/usr/bin/env python3
"""Unit tests for bulk discount logic in pricing.js using Node.js subprocess."""

import subprocess
import json
import os
import unittest


def run_calculate_total(items):
    """Call the calculateTotal function from pricing.js via Node.js."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    pricing_js_path = os.path.join(script_dir, 'pricing.js')

    # Build a Node.js script that loads pricing.js and calls calculateTotal
    # pricing.js uses module.exports, so we need to handle that
    node_script = f"""
    const path = require('path');
    const pricingPath = {json.dumps(pricing_js_path)};
    const pricing = require(pricingPath);
    const items = {json.dumps(items)};
    const result = pricing.calculateTotal(items);
    console.log(JSON.stringify(result));
    """
    result = subprocess.run(
        ['node', '-e', node_script],
        capture_output=True,
        text=True,
        cwd=script_dir
    )

    if result.returncode != 0:
        raise RuntimeError(f"Node.js error: {result.stderr}")

    return json.loads(result.stdout)


class TestBulkDiscountLogic(unittest.TestCase):
    """Test cases for bulk discount logic in pricing.js."""

    def test_no_discount_qty_10_or_less(self):
        """Items with qty <= 10 should get no discount."""
        items = [
            {"priceAtAdd": 100, "qty": 5},
            {"priceAtAdd": 50, "qty": 10}
        ]
        result = run_calculate_total(items)

        self.assertEqual(len(result['lineItems']), 2)
        self.assertFalse(result['lineItems'][0]['discountApplied'])
        self.assertEqual(result['lineItems'][0]['discount'], 0)
        self.assertEqual(result['lineItems'][0]['lineTotal'], 500)  # 100 * 5

        self.assertFalse(result['lineItems'][1]['discountApplied'])
        self.assertEqual(result['lineItems'][1]['lineTotal'], 500)  # 50 * 10

    def test_bulk_discount_qty_over_10(self):
        """Items with qty > 10 should get 20% discount."""
        items = [
            {"priceAtAdd": 100, "qty": 15}
        ]
        result = run_calculate_total(items)

        self.assertEqual(len(result['lineItems']), 1)
        self.assertTrue(result['lineItems'][0]['discountApplied'])
        self.assertEqual(result['lineItems'][0]['discount'], 20)
        # 100 * 15 * 0.80 = 1200
        self.assertEqual(result['lineItems'][0]['lineTotal'], 1200)

    def test_mixed_items_with_and_without_discount(self):
        """Mix of items with and without bulk discount."""
        items = [
            {"priceAtAdd": 100, "qty": 5},   # No discount: 500
            {"priceAtAdd": 100, "qty": 15}   # 20% off: 1200
        ]
        result = run_calculate_total(items)

        self.assertEqual(result['lineItems'][0]['discountApplied'], False)
        self.assertEqual(result['lineItems'][1]['discountApplied'], True)
        self.assertEqual(result['subtotal'], 1700)  # 500 + 1200

    def test_invalid_items_filtered_out(self):
        """Invalid items should be filtered out."""
        items = [
            {"priceAtAdd": 100, "qty": 5},
            {"priceAtAdd": None, "qty": 5},       # Invalid: no price
            {"priceAtAdd": "not a number", "qty": 5},  # Invalid: NaN price
            {"priceAtAdd": 100, "qty": 0},        # Invalid: qty <= 0
            {"priceAtAdd": 100, "qty": -1},       # Invalid: negative qty
            None,                                  # Invalid: null item
            {"qty": 5},                           # Invalid: no priceAtAdd
        ]
        result = run_calculate_total(items)

        # Only one valid item should remain
        self.assertEqual(len(result['lineItems']), 1)
        self.assertEqual(result['lineItems'][0]['priceAtAdd'], 100)
        self.assertEqual(result['subtotal'], 500)

    def test_empty_items_list(self):
        """Empty items list should return empty lineItems and 0 subtotal."""
        result = run_calculate_total([])

        self.assertEqual(result['lineItems'], [])
        self.assertEqual(result['subtotal'], 0)

    def test_exact_boundary_qty_10_no_discount(self):
        """Qty exactly 10 should NOT get discount (boundary test)."""
        items = [
            {"priceAtAdd": 100, "qty": 10}
        ]
        result = run_calculate_total(items)

        self.assertFalse(result['lineItems'][0]['discountApplied'])
        self.assertEqual(result['lineItems'][0]['discount'], 0)
        self.assertEqual(result['lineItems'][0]['lineTotal'], 1000)  # 100 * 10

    def test_exact_boundary_qty_11_discount(self):
        """Qty exactly 11 should get discount (boundary test)."""
        items = [
            {"priceAtAdd": 100, "qty": 11}
        ]
        result = run_calculate_total(items)

        self.assertTrue(result['lineItems'][0]['discountApplied'])
        self.assertEqual(result['lineItems'][0]['discount'], 20)
        # 100 * 11 * 0.80 = 880
        self.assertEqual(result['lineItems'][0]['lineTotal'], 880)

    def test_decimal_price(self):
        """Test with decimal prices."""
        items = [
            {"priceAtAdd": 99.99, "qty": 15}  # Should get 20% discount
        ]
        result = run_calculate_total(items)

        self.assertTrue(result['lineItems'][0]['discountApplied'])
        # 99.99 * 15 * 0.80 = 1199.88, rounded to 2 decimals
        expected = round(99.99 * 15 * 0.80, 2)
        self.assertEqual(result['lineItems'][0]['lineTotal'], expected)

    def test_subtotal_calculation(self):
        """Test subtotal is correctly calculated from all line totals."""
        items = [
            {"priceAtAdd": 100, "qty": 5},    # 500
            {"priceAtAdd": 200, "qty": 15},    # 200 * 15 * 0.80 = 2400
            {"priceAtAdd": 50, "qty": 20},     # 50 * 20 * 0.80 = 800
        ]
        result = run_calculate_total(items)

        expected_subtotal = 500 + 2400 + 800
        self.assertEqual(result['subtotal'], expected_subtotal)


if __name__ == '__main__':
    unittest.main(verbosity=2)

/**
 * seed.js  —  Populate the 'inventory' collection with updated schema
 *
 * Usage (from the server/ directory):
 *   node seed.js
 */

const mongoose  = require('mongoose');
const dotenv    = require('dotenv');
const Inventory = require('./models/Inventory');

dotenv.config();

const products = [
  {
    productId:   'FP-001',
    name:        'Classic Fountain Pen',
    category:    'Fountain Pens',
    description: 'A timeless writing instrument crafted for those who appreciate the art of the written word. Features an 18k gold-plated nib for a smooth, consistent ink flow. Perfect for journaling, letter-writing, and everyday elegance.',
    price:       120.00,
    image:       'Fountain-pen(OnyxBlack).webp',
    variants: [
      { sku: 'FP-001-BLK', name: 'Onyx Black', colorCode: '#1a1a1a', stock: 45, imageURL: 'Fountain-pen(OnyxBlack).webp' },
      { sku: 'FP-001-NVY', name: 'Navy Blue',  colorCode: '#1e3a8a', stock: 30, imageURL: 'Fountain-pen(NavyBlue).webp' },
      { sku: 'FP-001-CRM', name: 'Crimson',    colorCode: '#7f1d1d', stock: 12, imageURL: 'Fountain-pen(crimsomwebp.webp' },
    ],
    stock: 87,
  },
  {
    productId:   'INK-001',
    name:        'Midnight Ink 50ml',
    category:    'Inks',
    description: 'A deep, archival-quality ink with a hint of blue-black sheen. Water-resistant when dry. Formulated for fountain pens, dip pens, and calligraphy. The ink of choice for professionals and collectors alike.',
    price:       24.50,
    image:       'Midnight-Ink.webp',
    variants:    [],
    stock:       200,
  },
  {
    productId:   'NP-001',
    name:        'Artisan Leather Journal',
    category:    'Notebooks & Paper',
    description: 'Hand-stitched from full-grain vegetable-tanned leather. Features 240 pages of 100gsm acid-free paper — fountain pen friendly with zero bleed-through. The journal that improves with age, just like your handwriting.',
    price:       45.00,
    image:       'journal(Tanleather).webp',
    variants: [
      { sku: 'NP-001-TAN', name: 'Tan Leather',  colorCode: '#d97706', stock: 25, imageURL: 'journal(Tanleather).webp' },
      { sku: 'NP-001-DBR', name: 'Dark Brown',   colorCode: '#451a03', stock: 18, imageURL: 'journal(DarkBrown).webp' },
    ],
    stock: 43,
  },
  {
    productId:   'CAL-001',
    name:        'Calligraphy Starter Set',
    category:    'Calligraphy Sets',
    description: 'Everything a beginner needs to master the ancient art of calligraphy. Includes 5 nib sizes, 2 ink bottles (black & sepia), a practice workbook with 50 guided pages, and a solid brass pen holder.',
    price:       85.00,
    image:       'calligraphy_kit.webp',
    variants:    [],
    stock:       60,
  },
  {
    productId:   'ACC-001',
    name:        'Gold Nib Replacement',
    category:    'Accessories',
    description: 'Replace or upgrade your fountain pen nib with our 18k gold-plated precision nibs. Available in three tip sizes to suit your handwriting style — from fine hairlines to bold, expressive strokes.',
    price:       150.00,
    image:       'Golden_nib(Medium).webp',
    variants: [
      { sku: 'ACC-001-FIN', name: 'Fine',   colorCode: '#fcd34d', stock: 20, imageURL: 'Golden_nib(Fine).webp' },
      { sku: 'ACC-001-MED', name: 'Medium', colorCode: '#fbbf24', stock: 35, imageURL: 'Golden_nib(Medium).webp' },
      { sku: 'ACC-001-BRD', name: 'Broad',  colorCode: '#f59e0b', stock: 15, imageURL: 'Golden_nib(Broad).webp' },
    ],
    stock: 70,
  },
  {
    productId:   'NP-002',
    name:        'Premium Linen Paper 100 Sheets',
    category:    'Notebooks & Paper',
    description: 'Luxurious linen-textured writing paper, 120gsm, A4 size. Acid-free and archival quality. Compatible with fountain pens, ballpoints, and gel pens. Ideal for correspondence, invitations, and artistic work.',
    price:       35.00,
    image:       'Linen_sheets.jpg',
    variants:    [],
    stock:       150,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    const deleted = await Inventory.deleteMany({});
    console.log(`  Cleared ${deleted.deletedCount} existing inventory document(s)`);

    const inserted = await Inventory.insertMany(products);
    console.log(` Inserted ${inserted.length} product(s) into the inventory collection:`);
    inserted.forEach(p => console.log(`   • [${p.productId}] ${p.name}  (stock: ${p.stock})`));

    console.log('\n Seeding complete!');
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log(' MongoDB disconnected');
  }
}

seed();

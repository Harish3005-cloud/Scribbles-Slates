const PRODUCT_IMAGE_BY_NAME = {
  // New catalog titles
  'Aero Matte Roller Pen': 'Aero Matte Roller Pen.webp',
  'Copperplate Practice Kit': 'Copperplate Practice Kit.webp',
  'Daily Notes Journal': 'Daily Notes Journal.jpg',
  'Emerald Green Ink': 'Emerald Green Ink.webp',
  'Everyday Student Pen': 'Everyday Student Pen.webp',
  'Executive Ruled Notebook': 'Executive Ruled Notebook.webp',
  'Fine Nib Unit': 'Fine Nib Unit.jpg',
  'Heritage Black Fountain Pen': 'Heritage Black Fountain Pen.webp',
  // Keep extension-less filename because that's how the asset currently exists.
  'Italic Script Learning Set': 'Italic Script Learning Set',
  'Jet Black Ink': 'Jet Black Ink.webp',
  'Modern Brush Calligraphy Kit': 'Modern Brush Calligraphy Kit.webp',
  'Ocean Blue Signature Pen': 'Ocean Blue Signature Pen.webp',
  'Pen Carry Pouch': 'Pen Carry Pouch.webp',
  'Royal Blue Ink': 'Royal Blue Ink.webp',
  'Sepia Brown Ink': 'Sepia Brown Ink.webp',
  'Signature Desk Fountain Pen': 'Signature Desk Fountain Pen.jpeg',
  'Traveler Pocket Journal': 'Traveler Pocket Journal.webp',
  'Triple Pen Sleeve': 'Triple Pen Sleeve.webp',
  'Violet Bloom Ink': 'Violet Bloom Ink.webp',

  // Existing/previous seed titles -> keep previous image files as-is
  'Classic Fountain Pen': 'Fountain-pen(OnyxBlack).webp',
  'Midnight Ink 50ml': 'Midnight-Ink.webp',
  'Artisan Leather Journal': 'journal(Tanleather).webp',
  'Calligraphy Starter Set': 'calligraphy_kit.webp',
  'Gold Nib Replacement': 'Golden_nib(Medium).webp',
  'Premium Linen Paper 100 Sheets': 'Linen_sheets.jpg',
};

const LEGACY_IMAGE_BY_FILENAME = {
  // Previous images map to themselves (unchanged behavior for existing records)
  'Fountain-pen(OnyxBlack).webp': 'Fountain-pen(OnyxBlack).webp',
  'Fountain-pen(NavyBlue).webp': 'Fountain-pen(NavyBlue).webp',
  'Fountain-pen(crimsomwebp.webp': 'Fountain-pen(crimsomwebp.webp',
  'Midnight-Ink.webp': 'Midnight-Ink.webp',
  'journal(Tanleather).webp': 'journal(Tanleather).webp',
  'journal(DarkBrown).webp': 'journal(DarkBrown).webp',
  'calligraphy_kit.webp': 'calligraphy_kit.webp',
  'Golden_nib(Fine).webp': 'Golden_nib(Fine).webp',
  'Golden_nib(Medium).webp': 'Golden_nib(Medium).webp',
  'Golden_nib(Broad).webp': 'Golden_nib(Broad).webp',
  'Linen_sheets.jpg': 'Linen_sheets.jpg',
};

function imagePath(filename) {
  if (!filename) return '';
  return `/images/${encodeURIComponent(filename)}`;
}

export function resolveCatalogImage({ name, image }) {
  if (image && image.startsWith('/images/')) return image;
  if (image && LEGACY_IMAGE_BY_FILENAME[image]) return imagePath(LEGACY_IMAGE_BY_FILENAME[image]);
  // Support URL-decoded filenames that may arrive from older records.
  if (image) {
    const decodedImage = decodeURIComponent(image);
    if (LEGACY_IMAGE_BY_FILENAME[decodedImage]) return imagePath(LEGACY_IMAGE_BY_FILENAME[decodedImage]);
  }
  if (image) return imagePath(image);
  if (name && PRODUCT_IMAGE_BY_NAME[name]) return imagePath(PRODUCT_IMAGE_BY_NAME[name]);
  return '';
}

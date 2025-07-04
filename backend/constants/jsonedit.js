// Node.js script to clean price fields in all product JSON files in the products directory
// Usage:
//   1. Run: node backend/constants/jsonedit.js
//   2. This will overwrite all product JSON files with cleaned price fields.
//   3. Make sure your package.json has: "type": "module"

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCTS_DIR = path.join(__dirname, 'products');
const MIN_RANDOM_PRICE = 1000;
const MAX_RANDOM_PRICE = 50000;

function getRandomPrice() {
  return String(Math.floor(Math.random() * (MAX_RANDOM_PRICE - MIN_RANDOM_PRICE + 1)) + MIN_RANDOM_PRICE);
}

function cleanPrice(price) {
  if (typeof price !== 'string') price = String(price);
  // Remove all non-digit characters
  const numeric = price.replace(/\D/g, '');
  // If nothing left or original was not a number, use random
  if (!numeric || isNaN(Number(numeric))) {
    return getRandomPrice();
  }
  return numeric;
}

function processFile(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  let products;
  try {
    products = JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse', filePath);
    return;
  }
  let changed = false;
  if (Array.isArray(products)) {
    products.forEach(product => {
      if (product && typeof product === 'object' && 'price' in product) {
        const cleaned = cleanPrice(product.price);
        if (product.price !== cleaned) {
          product.price = cleaned;
          changed = true;
        }
      }
    });
    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf8');
      console.log('Cleaned:', path.basename(filePath));
    }
  }
}

function main() {
  const files = fs.readdirSync(PRODUCTS_DIR).filter(f => f.endsWith('.json'));
  files.forEach(file => {
    processFile(path.join(PRODUCTS_DIR, file));
  });
  console.log('Price cleaning complete.');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

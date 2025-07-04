import { Pool } from "pg";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// console.log(__dirname);
dotenv.config({ path: path.resolve(__dirname, "../.env") });
// console.log(path.resolve(__dirname, "../.env"));

// PostgreSQL connection config
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

const productsDir = path.join(__dirname, "products");
// console.log(productsDir);

async function pushProducts() {
  // Create table if it doesn't exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      main_image TEXT,
      stock_quantity INTEGER,
      specifications JSONB,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  const files = fs.readdirSync(productsDir);
  // console.log(files);
  for (const file of files) {
    if (file.endsWith(".json")) {
      const filePath = path.join(productsDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      console.log(data[0]);
      for (const product of data) {
        await pool.query(
          `INSERT INTO products (name, price, description, category, main_image, stock_quantity, specifications)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            product.name,
            product.price,
            product.description,
            product.category,
            product.main_image,
            product.stock_quantity,
            product.specifications,
          ]
        );
      }
    }
  }
  await pool.end();
  console.log("All products pushed!");
}

pushProducts().catch((e) => {
  console.error("Error pushing products:", e);
  pool.end();
});

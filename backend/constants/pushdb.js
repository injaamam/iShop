import { Pool } from "pg";
import fs from "fs";
import path from "path";

// PostgreSQL connection config
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ishop",
  password: "ck675511",
  port: 5432,
});

const productsDir = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "products"
);

async function pushProducts() {
  const files = fs.readdirSync(productsDir);
  for (const file of files) {
    if (file.endsWith(".json")) {
      const filePath = path.join(productsDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
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

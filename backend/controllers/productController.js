import { sql } from "../config/db.js";

export const getLaptops = async (req, res) => {
  try {
    const products = await sql.query(
      "SELECT * FROM products WHERE category = 'laptop' ORDER BY id limit 20"
    );
    res.json(products.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

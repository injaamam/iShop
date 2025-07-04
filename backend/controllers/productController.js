import { sql } from "../config/db.js";

export const getProducts = async (req, res) => {
  try {
    const products = await sql.query("SELECT * FROM products limit 10");
    res.json(products.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

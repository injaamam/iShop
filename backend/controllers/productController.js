import { sql } from "../config/db.js";

const getProducts = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await sql.query(
      "SELECT id, name, price, main_image,description FROM products WHERE category = $1 LIMIT 20 ",
      [category]
    );
    res.json(products.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export default getProducts;

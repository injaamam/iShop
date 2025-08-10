import { sql } from "../config/db.js";

const getProductSpecification = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await sql.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    res.json(product.rows);
    // const product = await sql`SELECT * FROM products WHERE id = ${id}`;
    // res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product specification" });
  }
};

export default getProductSpecification;

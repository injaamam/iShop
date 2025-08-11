import { sql } from "../config/db.js";

const getProducts = async (req, res) => {
  const { category } = req.params;
  const page = Number(req.query.page || 1);
  const offset = (page - 1) * 20;
  try {
    const products = await sql.query(
      "SELECT id, name, price, main_image,description FROM products WHERE category = $1 ORDER BY id LIMIT 20 OFFSET $2",
      [category, offset]
    );

    if (products.rows.length === 0) {
      return res.json({ message: "Products not available" });
    } else return res.json(products.rows);

    // const products =
    //   await sql`SELECT id, name, price, main_image,description FROM products WHERE category = ${category} ORDER BY id LIMIT 20 OFFSET ${offset}`;
    // res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export default getProducts;

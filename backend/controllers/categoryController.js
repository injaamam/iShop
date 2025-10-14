import { sql } from "../config/db.js";

const getCategories = async (req, res) => {
  try {
    const categories = await sql.query(
      "SELECT DISTINCT category from products;"
    );
    res.json(categories.rows.map((row) => row.category));
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

export default getCategories;

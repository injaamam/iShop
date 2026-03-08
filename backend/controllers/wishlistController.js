import { sql } from "../config/db.js";

// GET /wishlist
export const getWishlist = async (req, res) => {
  try {
    const result = await sql.query(
      `SELECT w.id, w.product_id, p.name, p.price, p.main_image, p.category
       FROM wishlist w JOIN products p ON w.product_id = p.id
       WHERE w.user_id = $1 ORDER BY w.created_at DESC`,
      [req.user.id],
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
};

// POST /wishlist  { productId }
export const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  if (!productId)
    return res.status(400).json({ error: "productId is required" });

  try {
    const result = await sql.query(
      `INSERT INTO wishlist (user_id, product_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, product_id) DO NOTHING
       RETURNING *`,
      [req.user.id, productId],
    );
    if (result.rows.length === 0) {
      return res.json({ message: "Already in wishlist" });
    }
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({ error: "Failed to add to wishlist" });
  }
};

// DELETE /wishlist/:id
export const removeFromWishlist = async (req, res) => {
  try {
    const result = await sql.query(
      "DELETE FROM wishlist WHERE id = $1 AND user_id = $2 RETURNING *",
      [req.params.id, req.user.id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Item not found" });
    res.json({ message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove from wishlist" });
  }
};

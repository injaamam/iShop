import { sql } from "../config/db.js";

// GET /cart
export const getCart = async (req, res) => {
  try {
    const result = await sql.query(
      `SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.main_image
       FROM cart c JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1 ORDER BY c.created_at DESC`,
      [req.user.id],
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

// POST /cart  { productId, quantity? }
export const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId)
    return res.status(400).json({ error: "productId is required" });

  try {
    const result = await sql.query(
      `INSERT INTO cart (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = cart.quantity + $3
       RETURNING *`,
      [req.user.id, productId, quantity],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

// PUT /cart/:id  { quantity }
export const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  if (!quantity || quantity < 1)
    return res.status(400).json({ error: "Invalid quantity" });

  try {
    const result = await sql.query(
      "UPDATE cart SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [quantity, req.params.id, req.user.id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Item not found" });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update cart item" });
  }
};

// DELETE /cart/:id
export const removeFromCart = async (req, res) => {
  try {
    const result = await sql.query(
      "DELETE FROM cart WHERE id = $1 AND user_id = $2 RETURNING *",
      [req.params.id, req.user.id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Item not found" });
    res.json({ message: "Removed from cart" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove from cart" });
  }
};

import express from "express";
import { sql } from "../config/db.js";

const router = express.Router();

// Create tables
const init = async () => {
  await sql.query(`
    CREATE TABLE IF NOT EXISTS cart (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER DEFAULT 1,
      UNIQUE(user_id, product_id)
    )
  `);
  await sql.query(`
    CREATE TABLE IF NOT EXISTS wishlist (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      UNIQUE(user_id, product_id)
    )
  `);
};
init();

// ─── CART ───

// Get cart & wishlist product IDs (lightweight, for button states)
router.get("/user-status/:userId", async (req, res) => {
  const { userId } = req.params;
  const cartResult = await sql.query(
    "SELECT product_id FROM cart WHERE user_id = $1",
    [userId],
  );
  const wishlistResult = await sql.query(
    "SELECT product_id FROM wishlist WHERE user_id = $1",
    [userId],
  );
  res.json({
    cartIds: cartResult.rows.map((r) => r.product_id),
    wishlistIds: wishlistResult.rows.map((r) => r.product_id),
  });
});

// Get cart items
router.get("/cart/:userId", async (req, res) => {
  const { userId } = req.params;
  const result = await sql.query(
    `SELECT c.product_id, c.quantity, p.name, p.main_image, p.price
     FROM cart c JOIN products p ON c.product_id = p.id
     WHERE c.user_id = $1`,
    [userId],
  );
  res.json(result.rows);
});

// Add to cart (or increment quantity)
router.post("/cart", async (req, res) => {
  const { userId, productId } = req.body;
  await sql.query(
    `INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, 1)
     ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = cart.quantity + 1`,
    [userId, productId],
  );
  res.json({ message: "Added to cart" });
});

// Update quantity
router.put("/cart", async (req, res) => {
  const { userId, productId, quantity } = req.body;
  if (quantity < 1) {
    await sql.query("DELETE FROM cart WHERE user_id = $1 AND product_id = $2", [
      userId,
      productId,
    ]);
  } else {
    await sql.query(
      "UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3",
      [quantity, userId, productId],
    );
  }
  res.json({ message: "Cart updated" });
});

// Remove from cart
router.delete("/cart/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;
  await sql.query("DELETE FROM cart WHERE user_id = $1 AND product_id = $2", [
    userId,
    productId,
  ]);
  res.json({ message: "Removed from cart" });
});

// ─── WISHLIST ───

// Get wishlist
router.get("/wishlist/:userId", async (req, res) => {
  const { userId } = req.params;
  const result = await sql.query(
    `SELECT w.product_id, p.name, p.main_image, p.price
     FROM wishlist w JOIN products p ON w.product_id = p.id
     WHERE w.user_id = $1`,
    [userId],
  );
  res.json(result.rows);
});

// Toggle wishlist (add if missing, remove if exists)
router.post("/wishlist", async (req, res) => {
  const { userId, productId } = req.body;
  const existing = await sql.query(
    "SELECT id FROM wishlist WHERE user_id = $1 AND product_id = $2",
    [userId, productId],
  );
  if (existing.rows.length > 0) {
    await sql.query(
      "DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2",
      [userId, productId],
    );
    res.json({ message: "Removed from wishlist", added: false });
  } else {
    await sql.query(
      "INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2)",
      [userId, productId],
    );
    res.json({ message: "Added to wishlist", added: true });
  }
});

// Remove from wishlist
router.delete("/wishlist/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;
  await sql.query(
    "DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2",
    [userId, productId],
  );
  res.json({ message: "Removed from wishlist" });
});

export default router;

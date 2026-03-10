import express from "express";
import { sql } from "../config/db.js";

const router = express.Router();

// Register
router.post("/auth/register", async (req, res) => {
  const { name, email, password, address } = req.body;
  if (!name || !email || !password || !address)
    return res.status(400).json({ error: "All fields are required" });

  // Create table if not exists
  await sql.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      address TEXT NOT NULL
    )
  `);

  // Check duplicate
  const existing = await sql.query("SELECT id FROM users WHERE email = $1", [
    email,
  ]);
  if (existing.rows.length > 0)
    return res.status(409).json({ error: "Email already registered" });

  const result = await sql.query(
    "INSERT INTO users (name, email, password, address) VALUES ($1, $2, $3, $4) RETURNING id, name, email, address",
    [name, email, password, address],
  );
  res.status(201).json({ user: result.rows[0] });
});

// Login
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  const result = await sql.query(
    "SELECT id, name, email, address FROM users WHERE email = $1 AND password = $2",
    [email, password],
  );
  if (result.rows.length === 0)
    return res.status(401).json({ error: "Invalid email or password" });

  res.json({ user: result.rows[0] });
});

export default router;

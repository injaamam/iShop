import express from "express";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to iShop Backend!");
});

// app.get("/api/products/test", (req, res) => {
//   res.json({ message: "This is a test endpoint." });
// });
app.use("/api/products", productRoutes);

// async function initDB() {
//   try {
//     await sql`
//         create table if not exists products (
//             id serial primary key,
//             name text not null,
//             price numeric not null,
//             description text
//         );
//         `;
//     console.log("Database initialized successfully!");
//   } catch (error) {
//     console.error("Database connection failed:", error);
//   }
// }

// initDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

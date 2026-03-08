import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { initDB } from "./config/initDB.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to iShop Backend!");
});

app.use("/", productRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);

initDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

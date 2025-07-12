import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.get("/", (req, res) => {
  res.send("Welcome to iShop Backend!");
});

// app.get("/api/products/test", (req, res) => {
//   res.json({ message: "This is a test endpoint." });
// });
app.use("/", productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

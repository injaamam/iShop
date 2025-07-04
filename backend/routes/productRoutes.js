import expres from "express";
import { getProducts } from "../controllers/productController.js";

const router = expres.Router();

router.get("/", getProducts);

router.get("/test", (req, res) => {
  res.send("test route");
});

export default router;

import expres from "express";
import getProducts from "../controllers/productController.js";

const router = expres.Router();

router.get("/test", (req, res) => {
  res.send("test route");
});

router.get("/:category", getProducts);
export default router;

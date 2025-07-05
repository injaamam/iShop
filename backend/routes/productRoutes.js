import expres from "express";
import { getLaptops } from "../controllers/productController.js";

const router = expres.Router();

router.get("/laptop", getLaptops);

router.get("/test", (req, res) => {
  res.send("test route");
});

export default router;

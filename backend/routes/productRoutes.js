import expres from "express";
import getProducts from "../controllers/productController.js";
import getProductSpecification from "../controllers/productSpecificationController.js";

const router = expres.Router();

router.get("/test", (req, res) => {
  res.send("test route");
});

router.get("/:category", getProducts);
router.get("/product/:id", getProductSpecification);

export default router;

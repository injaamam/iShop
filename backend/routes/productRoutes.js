import expres from "express";
import getProducts from "../controllers/productController.js";
import getProductSpecification from "../controllers/productSpecificationController.js";
import getCategories from "../controllers/categoryController.js";

const router = expres.Router();

router.get("/test", (req, res) => {
  res.send("test route");
});

router.get("/categories", getCategories);
router.get("/category/:category", getProducts);
router.get("/product/:id", getProductSpecification);

export default router;

import expres from "express";
import {
  getProducts,
  getSpecificationKeys,
  getSpecificationValues,
  getProductCount,
} from "../controllers/productController.js";
import getProductSpecification from "../controllers/productSpecificationController.js";
import getCategories from "../controllers/categoryController.js";

const router = expres.Router();

router.get("/test", (req, res) => {
  res.send("Backend is working!");
});

router.get("/categories", getCategories);
router.get("/category/:category", getProducts);

// Routes for getting specification keys and values
router.get("/category/:category/filter", getSpecificationKeys);
router.get("/category/:category/filter/:key", getSpecificationValues);

router.get("/category/:category/count", getProductCount);
router.get("/product/:id", getProductSpecification);

export default router;

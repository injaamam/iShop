import expres from "express";
import {
  getProducts,
  getSpecificationKeys,
  getSpecificationValues,
} from "../controllers/productController.js";
import getProductSpecification from "../controllers/productSpecificationController.js";
import getCategories from "../controllers/categoryController.js";

const router = expres.Router();

router.get("/test", (req, res) => {
  res.send("test route");
});

router.get("/categories", getCategories);
router.get("/category/:category", getProducts); // Changed to POST to accept filters in body

// Routes for getting specification keys and values
router.get("/category/:category/filter", getSpecificationKeys);
router.get("/category/:category/filter/:key", getSpecificationValues);

router.get("/product/:id", getProductSpecification);

export default router;

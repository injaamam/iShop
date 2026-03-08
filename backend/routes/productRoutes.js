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

//test route for db connection and database structure showing
router.get("/x", (req, res) => {
  import("../config/db.js").then(({ sql }) => {
    sql
      .query("SELECT * FROM products LIMIT 2")
      .then((result) => res.json(result.rows))
      .catch((error) => res.status(500).json({ error: error.message }));
  });
});

export default router;

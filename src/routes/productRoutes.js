const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");
const verifyJWT = require("../middlewares/verifyJWT");

router.use(verifyJWT);

// GET all products
router.get("/", productController.getProducts);

// GET product by ID
router.get("/:id", productController.getProductById);

// POST create new product
router.post("/", productController.createProduct);

// PUT update existing product
router.put("/:id", productController.updateProduct);

// DELETE a product
router.delete("/:id", productController.deleteProduct);

module.exports = router;

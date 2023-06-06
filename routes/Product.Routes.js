const express = require('express')
const router = express.Router()
const ProductController = require("../controllers/ProductController") 
const Authorization = require('../middlewares/auth')


router.get("/products", Authorization , ProductController.getAllProducts);

router.get("/products/:id", Authorization , ProductController.getProductById);

router.post("/products", Authorization , ProductController.createNewProduct);

router.put("/products/:id", Authorization , ProductController.updateProductById);

router.delete("/products/:id", Authorization , ProductController.deleteProductById);

module.exports = router;
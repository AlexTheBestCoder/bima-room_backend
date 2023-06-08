const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');

router.get('/products', ProductController.getAllProducts);
router.get('/products/:id', ProductController.getProductById);
router.post('/products', ProductController.createNewProduct);
router.put('/products/:id', ProductController.updateProductById);
router.delete('/products/:id', ProductController.deleteProductById);

module.exports = router;

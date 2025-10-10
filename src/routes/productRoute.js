const express = require('express');
const {
  getAllProduct,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../services/productService');
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require('../utils/validator/productValidator');

const router = express.Router();

router
  .route('/')
  .post(createProductValidator, createProduct)
  .get(getAllProduct);
router
  .route('/:id')
  .get(getProductValidator, getProduct)
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;

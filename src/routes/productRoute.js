const express = require('express');
const {
  getAllProduct,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImages,
  resizeImages,
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
  .post(uploadImages, resizeImages, createProductValidator, createProduct)
  .get(getAllProduct);
router
  .route('/:id')
  .get(getProductValidator, getProduct)
  .put(uploadImages, resizeImages, updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;

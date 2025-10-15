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
const { protect, allowedTo } = require('../services/authService');
const reviewRoute = require('./reviewRoute')

const router = express.Router();

router.use('/:productId/reviews',reviewRoute)

router
  .route('/')
  .post(
    protect,
    allowedTo('admin', 'manager'),
    uploadImages,
    resizeImages,
    createProductValidator,
    createProduct
  )
  .get(getAllProduct);
router
  .route('/:id')
  .get(getProductValidator, getProduct)
  .put(
    protect,
    allowedTo('admin', 'manager'),
    uploadImages,
    resizeImages,
    updateProductValidator,
    updateProduct
  )
  .delete(protect, allowedTo('admin'), deleteProductValidator, deleteProduct);

module.exports = router;

const express = require('express');
const {
  getAllBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require('../services/brandService');
const {
  getBrandValidator,
  createBrandValidator,
  deleteBrandValidator,
  updateBrandValidator,
} = require('../utils/validator/brandValidator');
const { protect, allowedTo } = require('../services/authService');

const router = express.Router();

router
  .route('/')
  .post(
    protect,
    allowedTo('admin', 'manager'),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand
  )
  .get(getAllBrands);
router
  .route('/:id')
  .get(getBrandValidator, getBrand)
  .put(
    protect,
    allowedTo('admin', 'manager'),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(protect, allowedTo('admin'), deleteBrandValidator, deleteBrand);

module.exports = router;

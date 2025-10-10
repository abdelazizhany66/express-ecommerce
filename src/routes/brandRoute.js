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

const router = express.Router();

router
  .route('/')
  .post(uploadBrandImage, resizeImage, createBrandValidator, createBrand)
  .get(getAllBrands);
router
  .route('/:id')
  .get(getBrandValidator, getBrand)
  .put(uploadBrandImage, resizeImage, updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

module.exports = router;

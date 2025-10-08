const express = require('express');
const {
  getAllBrands,
  getBrand,
  createBrand,
  updateBrand,deleteBrand
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
  .post(createBrandValidator, createBrand)
  .get(getAllBrands);
router
  .route('/:id')
  .get(getBrandValidator, getBrand)
  .put(updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator,deleteBrand);

module.exports = router;

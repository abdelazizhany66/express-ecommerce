const express = require('express');

const {
  getAllCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require('../services/categoryService');
const {
  getCategoryValidator,
  createCategoryValidator,
  deleteCategoryValidator,
  updateCategoryValidator,
} = require('../utils/validator/categoryValidator');
const subCategoryRoute = require('./subCategoryRoute');
const { protect, allowedTo } = require('../services/authService');

const router = express.Router();

//Nested Route
router.use('/:categoryId/subcategories', subCategoryRoute);

router
  .route('/')
  .post(
    protect,
    allowedTo('admin', 'manager'),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  )
  .get(getAllCategories);
router
  .route('/:id')
  .get(getCategoryValidator, getCategory)
  .put(
    protect,
    allowedTo('admin', 'manager'),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(protect, allowedTo('admin'), deleteCategoryValidator, deleteCategory);

module.exports = router;

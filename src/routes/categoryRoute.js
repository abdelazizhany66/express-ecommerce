const express = require('express');
const {
  getAllCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require('../services/categoryService');
const {
  getCategoryValidator,
  createCategoryValidator,
  deleteCategoryValidator,
  updateCategoryValidator,
} = require('../utils/validator/categoryValidator');
const subCategoryRoute = require("./subCategoryRoute")

const router = express.Router();

//Nested Route
router.use('/:categoryId/subcategories',subCategoryRoute)

router
  .route('/')
  .post(createCategoryValidator, createCategory)
  .get(getAllCategories);
router
  .route('/:id')
  .get(getCategoryValidator, getCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;

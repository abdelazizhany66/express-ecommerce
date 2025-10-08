const { Router } = require('express');
const {
  createSubCategory,
  getAllSubCategories,
  getSubCategory,
  deleteSubCategory,
  updateSubCategory,
  setCategoryIdToBody
} = require('../services/subCategoryService');
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require('../utils/validator/subCategoryValidator');

//when get any foregn route search to value
//{mergeParams:true} Allow to access parameters to other router
const router = Router({mergeParams:true});

router
  .route('/')
  .post(setCategoryIdToBody,createSubCategoryValidator, createSubCategory)
  .get(getAllSubCategories);
router
  .route('/:id')
  .get(getSubCategoryValidator, getSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);
module.exports = router;

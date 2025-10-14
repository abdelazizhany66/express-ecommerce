const { Router } = require('express');
const {
  createSubCategory,
  getAllSubCategories,
  getSubCategory,
  deleteSubCategory,
  updateSubCategory,
  setCategoryIdToBody,
  createFilterObj,
} = require('../services/subCategoryService');
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require('../utils/validator/subCategoryValidator');
const { protect, allowedTo } = require('../services/authService');

//when get any foregn route search to value
//{mergeParams:true} Allow to access parameters to other router
const router = Router({ mergeParams: true });

router
  .route('/')
  .post(
    protect,
    allowedTo('admin', 'manager'),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(createFilterObj, getAllSubCategories);
router
  .route('/:id')
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    protect,
    allowedTo('admin', 'manager'),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    protect,
    allowedTo('admin'),
    deleteSubCategoryValidator,
    deleteSubCategory
  );
module.exports = router;

const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const SubCategory = require('../models/subCategoryModel');
const APIError = require('../utils/apiError');

// nested route
exports.setCategoryIdToBody = (req,res,next)=>{
  if(!req.body.category) req.body.category = req.params.categoryId
next()
}
//@desc create new subCategory
//@rout POST /api/v1/subcategories
//@access Private
exports.createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  const newSubCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(200).json({ date: newSubCategory });
});

//nested route
exports.createFilterObj = (req,res,next)=>{
  let filterObj = {}
  if(req.params.categoryId) filterObj = {category:req.params.categoryId}
  req.filterObj = filterObj
  next()
}
//@desc Gat All subCategories
//@rout GET /api/v1/subcategories
//@access Public
exports.getAllSubCategories = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  const skip = (page - 1) * limit;

  const subCategories = await SubCategory.find(req.filterObj).skip(skip).limit(limit);
  res
    .status(200)
    .json({ result: subCategories.length, page, data: subCategories });
});

//@desc create new subCategory
//@rout GET /api/v1/subcategories
//@access Public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findById(id);
  if (!subCategory) {
    next(new APIError(`no category for this id:${id}`, 404));
  }
  res.status(200).json({ date: subCategory });
});

//@desc Update specific Category
//@route PUT /api/v1/categories
//@access Private
exports.updateSubCategory = asyncHandler(async (req, res,next) => {
  const { id } = req.params;
  const {name,category} = req.body
  const subCategory = await SubCategory.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name),category },
    { new: true }
  );
  if (!subCategory) {
    return next(new APIError(`no subCategory for this id:${id}`, 404));
  }
  res.status(201).json({ date: subCategory });
});

//@desc DELETE specific Category
//@route DELETE /api/v1/categories
//@access Private
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findOneAndDelete({ _id: id });
  if (!subCategory) {
    return next(new APIError(`no subCategory for this id:${id}`, 404));
  }
  res.status(201).send(`subCategory : ${subCategory.name} is deleted`);
});
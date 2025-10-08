const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const Category = require('../models/categoryModel');
const APIError = require('../utils/apiError');

//@desc Gat All Categories
//@rout GET /api/v1/categories
//@access Public
exports.getAllCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit || 5;
  const skip = (page - 1) * limit;

  const Categorties = await Category.find().skip(skip).limit(limit);
  res
    .status(202)
    .json({ reusult: Categorties.length, page, date: Categorties });
});

//@desc create new Category
//@rout POST /api/v1/categories
//@access Private
exports.createCategory = asyncHandler(async (req, res) => {
  const {name} = req.body;
  const newCategorty = await Category.create({
    name,
    slug: slugify(name),
  });
  res.status(202).json({ newCategorty });
});

//@desc get Category
//@rout GET /api/v1/categories
//@access Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return next(new APIError(`no category for this id:${id}`, 404));
  }
  res.status(201).json({ date: category });
});

//@desc Update specific Category
//@route PUT /api/v1/categories
//@access Private
exports.updateCategory = asyncHandler(async (req, res,next) => {
  const { id } = req.params;
  const {name} = req.body
  const category = await Category.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!category) {
    return next(new APIError(`no category for this id:${id}`, 404));
  }
  res.status(201).json({ date: category });
});

//@desc DELETE specific Category
//@route DELETE /api/v1/categories
//@access Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findOneAndDelete({ _id: id });
  if (!category) {
    return next(new APIError(`no category for this id:${id}`, 404));
  }
  res.status(201).send(`category : ${category.name} is deleted`);
});

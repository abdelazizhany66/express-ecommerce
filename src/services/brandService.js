const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const Brand = require('../models/brandModel');
const APIError = require('../utils/apiError');

//@desc Gat All Brands
//@rout GET /api/v1/brands
//@access Public
exports.getAllBrands = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit || 5;
  const skip = (page - 1) * limit;

  const Brands = await Brand.find().skip(skip).limit(limit);
  res
    .status(202)
    .json({ reusult: Brands.length, page, date: Brands });
});

//@desc create new Brand
//@rout POST /api/v1/categories
//@access Private
exports.createBrand = asyncHandler(async (req, res) => {
  const {name} = req.body;
  const newBrand = await Brand.create({
    name,
    slug: slugify(name),
  });
  res.status(202).json({ newBrand });
});

//@desc get specific Brand
//@rout GET /api/v1/categories
//@access Public
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (!brand) {
    return next(new APIError(`no brand for this id:${id}`, 404));
  }
  res.status(201).json({ date: brand });
});

//@desc Update specific Brand
//@route PUT /api/v1/brands/:id
//@access Private
exports.updateBrand = asyncHandler(async (req, res,next) => {
  const { id } = req.params;
  const {name} = req.body
  const brand = await Brand.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!brand) {
    return next(new APIError(`no brand for this id:${id}`, 404));
  }
  res.status(201).json({ date: brand });
});

//@desc DELETE specific Brands
//@route DELETE /api/v1/brands/:id
//@access Private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findOneAndDelete({ _id: id });
  if (!brand) {
    return next(new APIError(`no brand for this id:${id}`, 404));
  }
  res.status(201).send(`brand : ${brand.name} is deleted`);
});

const asyncHandler = require('express-async-handler');
const sharp = require('sharp');

const Category = require('../models/categoryModel');
const factory = require('./handlerFactory');
const { uploadSingleImage } = require('../middleware/uploadImageMiddleware');

exports.uploadCategoryImage = uploadSingleImage('image');

//image proccessing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${Date.now()}- ${Math.round(Math.random() * 1e9)}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600) //resize image
      .toFormat('jpeg') // ext image
      .jpeg({ quality: 95 }) // image quality
      .toFile(`uploads/categories/${filename}`); // where image save
  }

  req.body.image = filename; //save name in db
  next();
});

//@desc Gat All Categories
//@rout GET /api/v1/categories
//@access Public
exports.getAllCategories = factory.getAllDocs(Category);
// exports.getAllCategories = asyncHandler(async (req, res) => {
//   const documentCount = await Category.countDocuments();
//   const apiFeature = new ApiFeature(Category.find(), req.query)
//     .filter()
//     .sorting()
//     .pagination(documentCount)
//     .search()
//     .fieldsLimit();
//   // Execute query
//   const { mongooseQuery, paginationResult } = apiFeature;
//   const Categorties = await mongooseQuery;
//   res
//     .status(202)
//     .json({ reusult: Categorties.length, paginationResult, date: Categorties });
// });

//@desc create new Category
//@rout POST /api/v1/categories
//@access Private
exports.createCategory = factory.createDocument(Category);
// exports.createCategory = asyncHandler(async (req, res) => {
//   const { name } = req.body;
//   const newCategorty = await Category.create({
//     name,
//     slug: slugify(name),
//   });
//   res.status(202).json({ newCategorty });
// });

//@desc get Category
//@rout GET /api/v1/categories
//@access Public
exports.getCategory = factory.getOneDocument(Category);
// exports.getCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const category = await Category.findById(id);
//   if (!category) {
//     return next(new APIError(`no category for this id:${id}`, 404));
//   }
//   res.status(201).json({ date: category });
// });

//@desc Update specific Category
//@route PUT /api/v1/categories
//@access Private
exports.updateCategory = factory.updateDocument(Category);
// exports.updateCategory = asyncHandler(async (req, res,next) => {
//   const { id } = req.params;
//   const {name} = req.body
//   const category = await Category.findOneAndUpdate(
//     { _id: id },
//     { name, slug: slugify(name) },
//     { new: true }
//   );
//   if (!category) {
//     return next(new APIError(`no category for this id:${id}`, 404));
//   }
//   res.status(201).json({ date: category });
// });

//@desc DELETE specific Category
//@route DELETE /api/v1/categories
//@access Private
exports.deleteCategory = factory.deleteDocument(Category);
// exports.deleteCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const category = await Category.findOneAndDelete({ _id: id });
//   if (!category) {
//     return next(new APIError(`no category for this id:${id}`, 404));
//   }
//   res.status(201).send(`category : ${category.name} is deleted`);
// });

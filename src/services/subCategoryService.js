const SubCategory = require('../models/subCategoryModel');
const factory = require ('./handlerFactory')

// nested route
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
//@desc create new subCategory
//@rout POST /api/v1/subcategories
//@access Private
exports.createSubCategory = factory.createDocument(SubCategory)
// exports.createSubCategory = asyncHandler(async (req, res) => {
//   const newSubCategory = await SubCategory.create(req.body);
//   res.status(200).json({ date: newSubCategory });
// });

//nested route
exports.createFilterObj = (req, res, next) => {
  let filterObj = {};
  if (req.params.categoryId) filterObj = { category: req.params.categoryId };
  req.filterObj = filterObj;
  next();
};
//@desc Gat All subCategories
//@rout GET /api/v1/subcategories
//@access Public
exports.getAllSubCategories = factory.getAllDocs(SubCategory)
// exports.getAllSubCategories = asyncHandler(async (req, res) => {
//   const documentCount = await SubCategory.countDocuments();
//   const apiFeature = new ApiFeature(SubCategory.find( req.filterObj), req.query)
//     .filter()
//     .sorting()
//     .pagination(documentCount)
//     .search()
//     .fieldsLimit();
//   // Execute query
//   const { mongooseQuery, paginationResult } = apiFeature;
//   const subCategories = await mongooseQuery;
//   res
//     .status(200)
//     .json({
//       result: subCategories.length,
//       paginationResult,
//       data: subCategories,
//     });
// });

//@desc create new subCategory
//@rout GET /api/v1/subcategories
//@access Public
exports.getSubCategory = factory.getOneDocument(SubCategory)
// exports.getSubCategory = asyncHandler(async (req, res, next) => {
//   const subCategory = await SubCategory.findById(req.params.id);
//   if (!subCategory) {
//     next(new APIError(`no category for this id:${req.params.id}`, 404));
//   }
//   res.status(200).json({ date: subCategory });
// });

//@desc Update specific Category
//@route PUT /api/v1/categories
//@access Private
exports.updateSubCategory = factory.updateDocument(SubCategory)
// exports.updateSubCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const { name, category } = req.body;
//   const subCategory = await SubCategory.findOneAndUpdate(
//     { _id: id },
//     { name, slug: slugify(name), category },
//     { new: true }
//   );
//   if (!subCategory) {
//     return next(new APIError(`no subCategory for this id:${id}`, 404));
//   }
//   res.status(201).json({ date: subCategory });
// });

//@desc DELETE specific Category
//@route DELETE /api/v1/categories
//@access Private

exports.deleteSubCategory = factory.deleteDocument(SubCategory)
// exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const subCategory = await SubCategory.findOneAndDelete({ _id: id });
//   if (!subCategory) {
//     return next(new APIError(`no subCategory for this id:${id}`, 404));
//   }
//   res.status(201).send(`subCategory : ${subCategory.name} is deleted`);
// });

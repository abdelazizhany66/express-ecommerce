const Brand = require('../models/brandModel');
const factory = require('./handlerFactory');

//@desc Gat All Brands
//@rout GET /api/v1/brands
//@access Public
exports.getAllBrands = factory.getAllDocs(Brand)
// exports.getAllBrands = asyncHandler(async (req, res) => {
//   const documentCount = await Brand.countDocuments();
//   const apiFeature = new ApiFeature(Brand.find(), req.query)
//     .filter()
//     .sorting()
//     .pagination(documentCount)
//     .search()
//     .fieldsLimit();
//   // Execute query
//   const { mongooseQuery, paginationResult } = apiFeature;
//   const Brands = await mongooseQuery;
//   res
//     .status(202)
//     .json({ reusult: Brands.length, paginationResult, date: Brands });
// });

//@desc create new Brand
//@rout POST /api/v1/categories
//@access Private
exports.createBrand = factory.createDocument(Brand)
// exports.createBrand = asyncHandler(async (req, res) => {
//   const { name } = req.body;
//   const newBrand = await Brand.create({
//     name,
//     slug: slugify(name),
//   });
//   res.status(202).json({ newBrand });
// });

//@desc get specific Brand
//@rout GET /api/v1/categories
//@access Public
exports.getBrand = factory.getOneDocument(Brand)
// exports.getBrand = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const brand = await Brand.findById(id);
//   if (!brand) {
//     return next(new APIError(`no brand for this id:${id}`, 404));
//   }
//   res.status(201).json({ date: brand });
// });

//@desc Update specific Brand
//@route PUT /api/v1/brands/:id
//@access Private
exports.updateBrand = factory.updateDocument(Brand);
// exports.updateBrand = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const { name } = req.body;
//   const brand = await Brand.findByIdAndUpdate(
//     { _id: id },
//     { name, slug: slugify(name) },
//     { new: true }
//   );
//   if (!brand) {
//     return next(new APIError(`no brand for this id:${id}`, 404));
//   }
//   res.status(201).json({ date: brand });
// });

//@desc DELETE specific Brands
//@route DELETE /api/v1/brands/:id
//@access Private
exports.deleteBrand = factory.deleteDocument(Brand);
// exports.deleteBrand = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const brand = await Brand.findOneAndDelete({ _id: id });
//   if (!brand) {
//     return next(new APIError(`no brand for this id:${id}`, 404));
//   }
//   res.status(201).send(`brand : ${brand.name} is deleted`);
// });

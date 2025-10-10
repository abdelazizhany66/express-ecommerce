const Product = require('../models/productModel');
const factory = require('./handlerFactory');

//@desc return list of products
//@route GET /api/v1/products
//@access Private
exports.getAllProduct = factory.getAllDocs(Product, 'Product');
// exports.getAllProduct = asyncHandler(async (req, res) => {
//   const documentCount = await Product.countDocuments();
//   const apiFeature = new ApiFeature(Product.find(), req.query)
//     .filter()
//     .sorting()
//     .pagination(documentCount)
//     .search('Product')
//     .fieldsLimit();
//   // Execute query
//   const { mongooseQuery, paginationResult } = apiFeature;
//   const products = await mongooseQuery;

//   res
//     .status(200)
//     .json({ result: products.length, paginationResult, data: products });
// });

//@desc create new product
//@route POST /api/v1/products
//@access Private
exports.createProduct = factory.createDocument(Product);
// exports.createProduct = asyncHandler(async (req, res) => {
//   req.body.slug = slugify(req.body.title);
//   const newProduct = await Product.create(req.body);
//   res.status(201).json({ data: newProduct });
// });

//@desc Get specific product
//@route GET /api/v1/products
//@access public
exports.getProduct = factory.getOneDocument(Product);
// exports.getProduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const product = await Product.findById(id);
//   if (!product) {
//     next(new ApiError(`No product for this id:${id}`));
//   }
//   res.status(201).json({ data: product });
// });

//@desc update specific product
//@route PUT /api/v1/products
//@access Private
exports.updateProduct = factory.updateDocument(Product);
// exports.updateProduct = asyncHandler(async (req, res, next) => {
//   const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//   });
//   if (!product) {
//     next(new ApiError(`No product for this id:${req.params.id}`));
//   }
//   res.status(200).json({ data: product });
// });

//@desc Delete specific product
//@route DELETE /api/v1/products
//@access Private
exports.deleteProduct = factory.deleteDocument(Product);

// exports.deleteProduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const product = await Product.findByIdAndDelete({ _id: id });
//   if (!product) {
//     next(new ApiError(`No product for this id:${id}`));
//   }
//   res.status(200).json({ data: `it's product ${product.id} is Deleted` });
// });

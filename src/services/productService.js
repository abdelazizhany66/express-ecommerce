const sharp = require('sharp');
const multer = require('multer');
const asyncHandler = require('express-async-handler');

const Product = require('../models/productModel');
const factory = require('./handlerFactory');
const ApiError = require('../utils/apiError');
//1
const memoryStorage = multer.memoryStorage();
//2
const filterImage = function (req, file, cb) {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new ApiError(`Only image Allowed`, 400), false);
  }
};
//3
const uploads = multer({ storage: memoryStorage, fileFilter: filterImage });
//4
exports.uploadImages = uploads.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 5 },
]);
//5
exports.resizeImages = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const imageCoverFilename = `product-${Date.now()}- ${Math.round(Math.random() * 1e9)}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 600) //resize image
      .toFormat('jpeg') // ext image
      .jpeg({ quality: 95 }) // image quality
      .toFile(`uploads/products/${imageCoverFilename}`); // where image save}
    req.body.imageCover = imageCoverFilename;
  }

  if (req.files.images) {
    req.body.images = [];

    await Promise.all(

      req.files.images.map(async (image) => {
        const imagesName = `product-${Date.now()}- ${Math.round(Math.random() * 1e9)}-image.jpeg`;

        await sharp(image.buffer)
          .resize(2000, 600) //resize image
          .toFormat('jpeg') // ext image
          .jpeg({ quality: 95 }) // image quality
          .toFile(`uploads/products/${imagesName}`); // where image save}
        req.body.images.push(imagesName);
      })
    );
  }
  next()
});

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

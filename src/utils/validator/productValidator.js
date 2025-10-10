const slugify = require('slugify')
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');
const Category = require('../../models/categoryModel')
const SubCategory = require('../../models/subCategoryModel');

exports.getProductValidator = [
  check('id').isMongoId().withMessage('invalid Product'),
  validatorMiddleware,
];

exports.createProductValidator = [
  check('title')
    .notEmpty()
    .withMessage('title is required')
    .isLength({ min: 3 })
    .withMessage('Too short product title')
    .custom((val, {req})=>{
    req.body.slug = slugify(val)
    return true
  }),
  check('description')
    .notEmpty()
    .withMessage('Product Description is required')
    .isLength({ max: 2000 })
    .withMessage('Too long Product Description'),
  check('sold').optional().isNumeric().withMessage('sold should be number'),
  check('price')
    .notEmpty()
    .withMessage('Product Price Is Required')
    .isNumeric()
    .withMessage('prices is number')
    .isLength({ max: 10 })
    .withMessage('Too long Product Price'),
  check('quantity')
    .notEmpty()
    .withMessage('product quantity is required')
    .isNumeric()
    .withMessage('quantity must be a number'),
  check('priceAfterDiscount')
    .optional()
    .isNumeric()
    .withMessage('priceAfterDiscount must be number')
    .isFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error('priceAfterDiscount must be greater than price');
      }
      return true;
    }),
  check('ratingAvarage')
    .optional()
    .isNumeric()
    .withMessage('Product rating must be a number')
    .isFloat()
    .isLength({ min: 1 })
    .withMessage('Rating must be a belong or equle 1')
    .isLength({ max: 5 })
    .withMessage('Rating must be a below or equle 5'),
  check('ratingQuantity')
    .optional()
    .isNumeric()
    .withMessage('Rating must be a number'),
  check('color')
    .optional()
    .isArray()
    .withMessage('Color should be array of string'),
  check('imageCover').notEmpty().withMessage('Image Cover is required'),
  check('image')
    .optional()
    .isArray()
    .withMessage('product Image should be array of string '),
  check('category')
    .notEmpty()
    .withMessage('Product Must be belong to category')
    .isMongoId()
    .withMessage('invalid category id')
    .custom(async (categoryId)=>{
     const category =await  Category.findById(categoryId)
      if(!category){
        throw new Error('no category in this id')
      }
   
    }),
  check('subcategories')
    .optional()
    .isMongoId()
    .withMessage('invalid subcategory id')
    .custom(async(subcategoriesIds)=>{
      const result = await SubCategory.find({_id:{$in:subcategoriesIds}})
      if(!result.length || result.length !== subcategoriesIds.length){
        throw new Error( 'No subcategories in this ids')
      }
      return true
    })
    .custom(async(subcategoriesIds,{req})=>{
      const subCategories = await SubCategory.find({category:req.body.category})

      //get ids from list of subcategory
      const subCategoriesIdsDB = subCategories.map((sub)=> sub._id.toString())
      //because we sure all ids write in body include in subCategoriesIdsDB(return from database)
      const isValid = subcategoriesIds.every((id)=>subCategoriesIdsDB.includes(id))
      if(!isValid){
        throw new Error('subCategories not belong to this category')
      }
      return true
    })
    ,
  check('brand').optional().isMongoId().withMessage('invalid brand id'),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check('id').isMongoId().withMessage('invalid Product'),
  body('title').optional().custom((val, {req})=>{
    req.body.slug = slugify(val)
    return true
  })
  ,
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check('id').isMongoId().withMessage('invalid Product'),
  validatorMiddleware,
];

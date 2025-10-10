const slugify = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');

exports.createSubCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('subCategory name is required')
    .isLength({ min: 3 })
    .withMessage('Too short name subCategory')
    .isLength({ max: 32 })
    .withMessage('Too long name subcategory')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('category')
    .notEmpty()
    .withMessage('category is required')
    .isMongoId()
    .withMessage('ID Is Defind'),
  validatorMiddleware,
];

exports.getSubCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid subCategory'),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check('id')
    .notEmpty()
    .withMessage('subCategory ID is required')
    .isMongoId()
    .withMessage('invalid subCategory'),
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check('id').isMongoId().withMessage('invalid subCategory'),
  validatorMiddleware,
];

const { check } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');

exports.createSubCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('subCategory name is required')
    .isLength({ min: 3 })
    .withMessage('Too short name subCategory')
    .isLength({ max: 32 })
    .withMessage('Too long name subcategory'),
  check('category')
    .notEmpty()
    .withMessage('category is required')
    .isMongoId()
    .withMessage('ID Is Defind'),
  validatorMiddleware,
];

exports.getSubCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid subCategory'),
  validatorMiddleware
]

exports.updateSubCategoryValidator = [
  check('id').notEmpty().withMessage('subCategory ID is required')
  .isMongoId().withMessage('invalid subCategory'),
  validatorMiddleware
];

exports.deleteSubCategoryValidator = [
  check('id').isMongoId().withMessage('invalid subCategory'),
  validatorMiddleware
];
const { check } = require ('express-validator')
const validatorMiddleware = require('../../middleware/validatorMiddleware')

exports.getCategoryValidator = [
  check('id').isMongoId().withMessage('invalid Category'),
  validatorMiddleware
];

exports.createCategoryValidator = [
  check('name').notEmpty().withMessage('name is required')
  .isLength({min:3}).withMessage('Too short name Category')
  .isLength({max:32}).withMessage('Too long name category'),
  validatorMiddleware
];

exports.updateCategoryValidator = [
  check('id').isMongoId().withMessage('invalid Category'),
  validatorMiddleware
];

exports.deleteCategoryValidator = [
  check('id').isMongoId().withMessage('invalid Category'),
  validatorMiddleware
];
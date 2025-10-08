const { check } = require ('express-validator')
const validatorMiddleware = require('../../middleware/validatorMiddleware')

exports.getBrandValidator = [
  check('id').isMongoId().withMessage('invalid Brand'),
  validatorMiddleware
];

exports.createBrandValidator = [
  check('name').notEmpty().withMessage('name is required')
  .isLength({min:3}).withMessage('Too short name Brand')
  .isLength({max:32}).withMessage('Too long name Brand'),
  validatorMiddleware
];

exports.updateBrandValidator = [
  check('id').isMongoId().withMessage('invalid Brand'),
  validatorMiddleware
];

exports.deleteBrandValidator = [
  check('id').isMongoId().withMessage('invalid Brand'),
  validatorMiddleware
];
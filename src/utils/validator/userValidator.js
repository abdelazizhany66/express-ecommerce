const slugify = require('slugify');
const { check, body } = require('express-validator');

const validatorMiddleware = require('../../middleware/validatorMiddleware');
const User = require('../../models/userModel');

exports.createUserValidator = [
  check('name')
    .notEmpty()
    .withMessage('name required')
    .isLength({ min: 3 })
    .withMessage('Too short name User')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
    .notEmpty()
    .withMessage('email required')
    .isEmail()
    .withMessage('it is not email please enter real email')
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new Error('email already in used');
      }
    }),
  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('invalid phone number only accept egy number and ask'),
  check('password')
    .notEmpty()
    .withMessage('password required')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters')
    .custom((password, { req }) => {
      if (req.body.passwordConfirm !== password) {
        throw new Error('password confirm in correct');
      }
      return true
    }),
  check('passwordConfirm').notEmpty().withMessage('password confirm required'),
  check('profileImg').optional(),
  validatorMiddleware,
];

exports.getUserValidator = [
  check('id').isMongoId().withMessage('invalid User'),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check('id').isMongoId().withMessage('invalid User'),
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check('id').isMongoId().withMessage('invalid User'),
  validatorMiddleware,
];

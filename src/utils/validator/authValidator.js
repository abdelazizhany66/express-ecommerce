const slugify = require('slugify');
const { check } = require('express-validator');

const validatorMiddleware = require('../../middleware/validatorMiddleware');
const User = require('../../models/userModel');

exports.signupValidator = [
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
  check('password')
    .notEmpty()
    .withMessage('password required')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters')
    .custom((password, { req }) => {
      if (req.body.passwordConfirm !== password) {
        throw new Error('password confirm in correct');
      }
      return true;
    }),
  check('passwordConfirm').notEmpty().withMessage('password confirm required'),
  validatorMiddleware,
];

exports.loginValidator = [
  check('email')
    .notEmpty()
    .withMessage('email required')
    .isEmail()
    .withMessage('it is not email please enter real email'),
  check('password')
    .notEmpty()
    .withMessage('password required')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters'),
  validatorMiddleware,
];

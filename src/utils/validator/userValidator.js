const slugify = require('slugify');
const { check, body } = require('express-validator');
const bcrypt = require('bcryptjs');

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
      return true;
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

exports.changePasswordValidator = [
  check('id').isMongoId().withMessage('invalid user'),
  check('currentPassword')
    .notEmpty()
    .withMessage('must be enter currentPassword'),
  check('password')
    .notEmpty()
    .withMessage('password required')

    .custom(async (val, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error('no user in this id');
      }
      const isCorrect = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrect) {
        throw new Error('current password not correct');
      }
      if (req.body.passwordConfirm !== val) {
        throw new Error('password confirm not equal password');
      }
      return true;
    }),
  check('passwordConfirm').notEmpty().withMessage('passwordConfirm required'),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check('id').isMongoId().withMessage('invalid User'),
  validatorMiddleware,
];

exports.UpdateLoggedUserDataValidator = [
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

  validatorMiddleware,
];

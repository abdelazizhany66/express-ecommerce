const { check, body } = require('express-validator');

const validatorMiddleware = require('../../middleware/validatorMiddleware');
const Review = require('../../models/reviewModel');

exports.createReviewValidator = [
  check('title').optional(),
  check('ratings')
    .notEmpty()
    .withMessage('rating is required')
    .isFloat({ min: 1, max: 5 })
    .withMessage(' rating must be between 1 to 5'),
  check('user').isMongoId().withMessage('invalid user id'),
  check('product')
    .isMongoId()
    .withMessage('invalid product id')
    .custom(async (val, { req }) => {
      //solve user must be write one review
      const review = await Review.findOne({
        user: req.user.id,
        product: req.body.product,
      });
      if (review) {
        throw new Error('You already reviewed this product before');
      }
      return true;
    }),
  validatorMiddleware,
];

exports.getReviewValidator = [
  check('id').isMongoId().withMessage('invalid Review'),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check('id')
    .isMongoId()
    .withMessage('invalid Review')
    .custom(async (val, { req }) => {
      //get all review for user
      const review = await Review.findById(val);
      if (!review) {
        throw new Error('no review in this product');
      }
      //user update to only reviews
      if (review.user._id.toString() !== req.user.id.toString()) {
        throw new Error(' you not allowed to update this review');
      }
      return true;
    }),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check('id')
    .isMongoId()
    .withMessage('invalid Review')
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);
      if (!review) {
        throw new Error('no review in this product');
      }
      if (req.user.role === 'user') {
        if (review.user.id.toString() !== req.user.id.toString()) {
          throw new Error(' you not allowed to update this review');
        }
      }
      return true;
    }),

  validatorMiddleware,
];

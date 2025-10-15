const express = require('express');
const {
  getAllReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
  createFilterObj,
  setCategoryIdToBody,
} = require('../services/reviewService');
const {
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
  getReviewValidator,
} = require('../utils/validator/reviewValidator');
const { protect, allowedTo } = require('../services/authService');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    protect,
    allowedTo('user'),
    setCategoryIdToBody,
    createReviewValidator,
    createReview
  )
  .get(createFilterObj, getAllReviews);
router
  .route('/:id')
  .get(getReviewValidator, getReview)
  .put(protect, updateReviewValidator, updateReview)
  .delete(
    protect,
    allowedTo('admin', 'user', 'manager'),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;

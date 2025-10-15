const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

//@desc Gat All Reviews
//@rout GET /api/v1/reviews
//@access Public
exports.getAllReviews = factory.getAllDocs(Review);
exports.createFilterObj = (req, res, next) => {
  let filterObj = {};
  if (req.params.productId) filterObj = { product: req.params.productId };
  req.filterObj = filterObj;
  next();
};
//@desc create new Review
//@rout POST /api/v1/reviews
//@access Private (user)
exports.createReview = factory.createDocument(Review);
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  next();
};

//@desc get specific Review
//@rout GET /api/v1/reviews
//@access Public
exports.getReview = factory.getOneDocument(Review);

//@desc Update specific Review
//@route PUT /api/v1/reviews/:id
//@access Private (user)
exports.updateReview = factory.updateDocument(Review);

//@desc DELETE specific Reviews
//@route DELETE /api/v1/reviews/:id
//@access Private (user,admin)
exports.deleteReview = factory.deleteDocument(Review);

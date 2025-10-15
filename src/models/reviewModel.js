const mongoose = require('mongoose');

const product = require('./productModel');

const reviewSchema = new mongoose.Schema(
  {
    title: String,
    ratings: {
      type: Number,
      min: [1, 'min rating value is 1.0'],
      max: [5, 'max rating value is 5.0'],
      required: [true, 'rating required between 1 to 5'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      require: [true, 'review must be belong to user'],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'review must belong to product'],
    },
  },
  { timestamps: true }
);



reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name' });
  next();
});

module.exports = mongoose.model('Review', reviewSchema);

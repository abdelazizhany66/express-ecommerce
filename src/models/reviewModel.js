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

reviewSchema.statics.calcAvarageRatingAndQuantity = async function (productId) {
  const result = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: productId,
        ratingAvarage: { $avg: '$ratings' },
        ratingQuantity: { $sum: 1 },
      },
    },
  ]);
  if (result.length > 0) {
    await product.findByIdAndUpdate(productId, {
      ratingAvarage: result[0].ratingAvarage,
      ratingQuantity: result[0].ratingQuantity,
    });
  } else {
    await product.findByIdAndUpdate(productId, {
      ratingAvarage: 0,
      ratingQuantity: 0,
    });
  }
};

reviewSchema.post('save', async function () {
  // this points to current review
  await this.constructor.calcAvarageRatingAndQuantity(this.product);
});

reviewSchema.post('deleteOne', { document: true }, async function () {
  await this.constructor.calcAvarageRatingAndQuantity(this.product);
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name' });
  next();
});

module.exports = mongoose.model('Review', reviewSchema);

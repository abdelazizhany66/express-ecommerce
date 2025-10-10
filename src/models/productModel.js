const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, ' product Title is required'],
      trim: true,
      minlength: [3, 'Too short product title'],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product Description is required'],
      maxlength: [2000, 'Too long Product Description'],
    },
    sold: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      required: [true, 'product quantity is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product Price Is Required'],
      trim: true,
      max: [200000, 'Too long Product Price'],
    },
    priceAfterDiscount: {
      type: Number,
    },
    ratingAvarage: {
      type: Number,
      min: [1, 'rating must be belong or equal 1.0'],
      max: [5, 'rating must be below or equal 5.0'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    color: [String],
    imageCover: {
      type: String,
      required: [true, 'Product Image Cover Is Required'],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'product must be belong to a category'],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory',
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: 'Brand',
    },
  },
  {
    timestamps: true,
  }
);

//mongoose Middleware
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'category',
    select: 'name -_id',
  });
  next()
});

module.exports = mongoose.model('Product', productSchema);

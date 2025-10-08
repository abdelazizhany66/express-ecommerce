const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'subCategory required'],
      unique: [true, 'subCategory must be Unique'],
      minlength: [3, 'too short subCategory name'],
      maxlength: [32, 'too long subCategory name'],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'subCategory must be belong to parent category'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SubCategory', subCategorySchema);

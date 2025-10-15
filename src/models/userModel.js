const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, 'name required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'email required'],
    },
    slug: {
      type: String,
      lowercase: true,
    },

    profileImg: String,

    phone: String,
    passwordChangedAt: Date,
    resetPasswordCode: String,
    resetPasswordExpires: Date,
    resetPasswordVerified: Boolean,

    password: {
      type: String,
      required: [true, 'password Required'],
      minlength: [6, 'too short password'],
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'manager'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
    },
   //chield refrence
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    //embedded 
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        address: String,
        city: String,
        postalCode: String,
        phone: String,
      },
    ],
  },

  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);

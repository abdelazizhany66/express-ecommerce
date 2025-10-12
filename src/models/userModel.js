const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, 'name required'],
      trim: true,
    },
    email:{
      type:String,
      required:[true,'email required']
    },
    slug: {
      type: String,
      lowercase: true,
    },

    profileImg: String,

    phone: String,

    password: {
      type: String,
      required: [true, 'password Required'],
      minlength: [6, 'too short password'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

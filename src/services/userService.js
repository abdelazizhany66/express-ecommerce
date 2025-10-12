const asyncHandler = require('express-async-handler');
const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/userModel');
const factory = require('./handlerFactory');
const ApiError = require('../utils/apiError');

const filterImage = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new ApiError('only image allwoed', 400), false);
  }
};

const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage, fileFilter: filterImage });
exports.uploadUserImage = upload.single('profileImg');

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600) //resize image
      .toFormat('jpeg') // ext image
      .jpeg({ quality: 95 }) // image quality
      .toFile(`uploads/users/${filename}`);
  }

  req.body.profileImg = filename;

  next();
});

//@desc Gat All Users
//@rout GET /api/v1/users
//@access private
exports.getAllUsers = factory.getAllDocs(User);

//@desc create new User
//@rout POST /api/v1/users
//@access Private
exports.createUser = factory.createDocument(User);

//@desc get User
//@rout GET /api/v1/users
//@access private
exports.getUser = factory.getOneDocument(User);

//@desc Update specific User
//@route PUT /api/v1/users
//@access Private
exports.updateUser = factory.updateDocument(User);

//@desc DELETE specific User
//@route DELETE /api/v1/users
//@access Private
exports.deleteUser = factory.deleteDocument(User);

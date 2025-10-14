const asyncHandler = require('express-async-handler');
const multer = require('multer');
const sharp = require('sharp');
const bcrypt = require('bcryptjs');

const User = require('../models/userModel');
const factory = require('./handlerFactory');
const ApiError = require('../utils/apiError');
const { createToken } = require('../utils/createToken');

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
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      profileImg: req.body.profileImg,
      phone: req.body.phone,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!document) {
    next(new ApiError(`No document for this id:${req.params.id}`));
  }
  res.status(200).json({ data: document });
});

exports.changePassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!document) {
    next(new ApiError(`No document for this id:${req.params.id}`));
  }
  res.status(200).json({ data: document });
});

//@desc DELETE specific User
//@route DELETE /api/v1/users
//@access Private
exports.deleteUser = factory.deleteDocument(User);

exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!user) {
    next(new ApiError(`No document for this id:${req.params.id}`));
  }

  const token = createToken(user.id);
  res.status(200).json({ data: user, accessToken: token });
});

exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    {
      new: true,
    }
  );
  if (!user) {
    next(new ApiError(`No user for this id:${req.user.id}`));
  }

  res.status(200).json({ data: user });
});

exports.deleteLoggedUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      active: false,
    },
    {
      new: true,
    }
  );
  if (!user) {
    next(new ApiError(`No user for this id:${req.user.id}`));
  }

  res.status(200).json({ status: 'success' });
});

exports.activeLoggedUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      active: true,
    },
    {
      new: true,
    }
  );
  if (!user) {
    next(new ApiError(`No user for this id:${req.user.id}`));
  }

  const token = createToken(user.id);
  res.status(200).json({ data: user, accessToken: token });
});

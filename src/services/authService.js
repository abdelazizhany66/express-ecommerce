const crypto = require('crypto');

const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/userModel');
const ApiError = require('../utils/apiError');
const sendEmail = require('../utils/sendEmail');

const accessToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });

//@desc signup user
//@rout POST /api/v1/auth/signup
//@access Public
exports.signUp = asyncHandler(async (req, res) => {
  const newUser = await User.create({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
  });

  const token = accessToken(newUser.id);
  res.status(201).json({ data: newUser, accessToken: token });
});

//@desc login user
//@rout POST /api/v1/auth/login
//@access Public
exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError('incorrect Email Or Password', 401));
  }

  const token = accessToken(user.id);
  res.status(201).json({ data: user, accessToken: token });
});

exports.protect = asyncHandler(async (req, res, next) => {
  // console.log(req.headers)
  //1) check if token exist , if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new ApiError(
        'you are not login, please login to get access this route',
        401
      )
    );
  }
  //2) verfy token if happen any change to data
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  //3) check of user in database or not
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError('this user not belong to this token does not exist', 401)
    );
  }

  //if user active or note
  if (!currentUser.active) {
    return next(
      new ApiError(
        'this user is Deactive please Active Account and Return login again',
        401
      )
    );
  }

  //4) check if user change password after token create
  let passChangedDateToTimeStamp;
  if (currentUser.passwordChangedAt) {
    passChangedDateToTimeStamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
  }
  if (passChangedDateToTimeStamp > decoded.iat) {
    return next(new ApiError('your password is change, please login again'));
  }

  req.user = currentUser;
  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError('you are not allowed to this route'));
    }
    next();
  });

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  //1) check if the user exists , if exists get user
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError('there is no user with that email', 403));
  }

  //2) create the random 6 digital
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  //3) hash the random digital and in database
  const hashResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');

  user.resetPasswordCode = hashResetCode;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
  user.resetPasswordVerified = false;

  await user.save();
  //4) send email to the user
  const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;

  try {
    await sendEmail({
      email: req.body.email,
      subject: 'Your password reset code (valid for 10 min)',
      text: message,
    });
  } catch (err) {
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    user.resetPasswordVerified = undefined;
    await user.save();
    return next(new ApiError('There is an error in sending email', 500));
  }

  res.status(200).json({
    status: 'success',
    message: ' reset code send to email successfully',
  });
});

exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(req.body.resetCode)
    .digest('hex');
  const user = await User.findOne({
    resetPasswordCode: hashedResetCode,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError('reste code Invalid oe Expired'));
  }
  user.resetPasswordVerified = true;
  user.save();
  res.status(200).json({ status: 'success' });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`there is no user in this email ${req.body.email}`, 404)
    );
  }
  if (!user.resetPasswordVerified) {
    //resetPasswordVerified = false

    return next(new ApiError('reset code not verified', 400));
  }
  user.password = req.body.newPassword;
  user.resetPasswordCode = undefined;
  user.resetPasswordExpires = undefined;
  user.resetPasswordVerified = undefined;
  user.save();
  const token = await accessToken(user.id);
  res.status(200).json({ status: 'success', accessToken: token });
});

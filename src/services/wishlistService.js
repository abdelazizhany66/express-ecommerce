const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

exports.addProductTowishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: 'success',
    message: 'product add successfullt to wishlist',
    data: user.wishlist,
  });
});

exports.removeProductFromWishList = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: 'success',
    message: 'product removed successfully from wish list',
    data: user.wishlist,
  });
});

exports.getLoggedUserWishList = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.status(200).json({
    status: 'success',
    result: user.wishlist.length,
    data: user.wishlist,
  });
});

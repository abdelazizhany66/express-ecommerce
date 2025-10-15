const express = require('express');
const {
  addProductTowishlist,
  removeProductFromWishList,
  getLoggedUserWishList,
} = require('../services/wishlistService');
const { protect, allowedTo } = require('../services/authService');

const router = express.Router();

router.use(protect, allowedTo('user'));
router.route('/').post(addProductTowishlist).get(getLoggedUserWishList);
router.delete('/:productId', removeProductFromWishList);

module.exports = router;

const express = require('express');
const {
  addToCartItems,
  getLoggedUserCart,
  removeSpecificCartItem,
  clearLoggedUserCartItem,
  updateCartItemQuantity,
  applyCouponAfterDiscount,
} = require('../services/cartService');

const { protect, allowedTo } = require('../services/authService');

const router = express.Router();

router.use(protect, allowedTo('user'));

router
  .route('/')
  .post(addToCartItems)
  .get(getLoggedUserCart)
  .delete(clearLoggedUserCartItem);

router.route('/applyCoupon').put(applyCouponAfterDiscount);

router
  .route('/:itemId')
  .delete(removeSpecificCartItem)
  .put(updateCartItemQuantity);

// router.route('/:id').get().put().delete();

module.exports = router;

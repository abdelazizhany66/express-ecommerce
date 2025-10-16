const asyncHandler = require('express-async-handler');

const Product = require('../models/productModel');
const Coupon = require('../models/couponModel');
const Cart = require('../models/cartModel');
const ApiError = require('../utils/apiError');

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined; //do not show in any route , but in this route only show applyCouponAfterDiscount

  return totalPrice;
};

// @desc    Add product to cart
// @route   POST /api/v1/cart
// @access  Private/User
exports.addToCartItems = asyncHandler(async (req, res, next) => {
  const { color, productId } = req.body;

  //get price from original product
  const product = await Product.findById(productId);

  //if no cart item to this user create new cart item
  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      cartItems: [{ color: color, product: productId, price: product.price }],
    });
  } else {
    // if user have a cart check if this product exist and return index of product
    const productExist = cart.cartItems.findIndex(
      (item) =>
        item.product.toString() === req.body.productId &&
        item.color === req.body.color
    );
    //if itemexist > -1 this meaning find product
    if (productExist > -1) {
      const object = cart.cartItems[productExist];
      object.quantity += 1;
      cart.cartItems[productExist] = object;
    } else {
      //if not find colore and prodect exist push new product object to cartItems
      cart.cartItems.push({
        color: color,
        product: product,
        price: product.price,
      });
    }
  }

  //calculate total price
  calcTotalCartPrice(cart);

  await cart.save();
  res.status(200).json({
    status: 'success',
    message: 'product added successfully',
    numberCartItems: cart.cartItems.length,
    data: cart,
  });
});


// @desc    get all product from cart
// @route   get /api/v1/cart
// @access  Private/User
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    next(new ApiError(`NO Cart To This User ${req.user.name}`));
  }
  res.status(200).json({
    status: 'success',
    numberCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    remove product to cart
// @route   put or delete /api/v1/cart/:itemId
// @access  Private/User
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user.id },
    { $pull: { cartItems: { _id: req.params.itemId } } },
    { new: true }
  );

  //calculate total price
  calcTotalCartPrice(cart);

  cart.save();
  res.status(200).json({
    status: 'success',
    numberCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Delete All product from cart
// @route   put or delete /api/v1/cart
// @access  Private/User
exports.clearLoggedUserCartItem = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user.id });
  res.status(204).send();
});


// @desc    Update quantity product in cart
// @route   put or delete /api/v1/cart
// @access  Private/User
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return next(new ApiError('no Cart From this user ', 404));
  }
  //return index to item want to update quantity
  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  //if return index enter in this if condetion
  if (itemIndex > -1) {
    //return item detials
    const cartItem = cart.cartItems[itemIndex];
    //update quantity to quantity in body
    cartItem.quantity = quantity;
    //save cartItem in base place
    cart.cartItems[itemIndex] = cartItem;
  } else {
    next(new ApiError('there is no item for this id', 404));
  }
  //calculate total praice again
  calcTotalCartPrice(cart);
  cart.save();

  res.status(200).json({
    status: 'success',
    numberCartItems: cart.cartItems.length,
    data: cart,
  });
});


// @desc    Apply coupon to all cart items
// @route   put /api/v1/cart/applyCoupon
// @access  Private/User
exports.applyCouponAfterDiscount = asyncHandler(async (req, res, next) => {
  //search for coupon
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new ApiError('no coupon in this name or expire', 404));
  }
  //get cart to update total price after discount
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError('you do not have cart', 404));
  }

  //get original total price
  const totalPrice = cart.totalCartPrice;
  //1000 - (1000*10)/100  if discount is 10%
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2); //5.58

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;

  await cart.save();
  res.status(200).json({
    status: 'success',
    numberCartItems: cart.cartItems.length,
    data: cart,
  });
});

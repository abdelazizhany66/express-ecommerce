const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require('express-async-handler');

const factory = require('./handlerFactory');
const User = require('../models/userModel');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ApiError = require('../utils/apiError');

exports.createCashOrder = asyncHandler(async (req, res, next) => {
  //Get User Cart
  const cart = await Cart.findOne({ user: req.user._id }); //req.params.cartId
  if (!cart) {
    return next(
      new ApiError(`this user haven't any cart : ${req.user._id}`, 404)
    );
  }
  const taxPrice = 0;
  const shippingPrice = 0;
  //Get total price if have coupone get total price after discount
  let totalPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  totalPrice = totalPrice + shippingPrice + taxPrice;
  //create order
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice: totalPrice,
    shippingAddress: req.body.shippingAddress,
  });

  //filter and update value of quantity and sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));

    await Product.bulkWrite(bulkOption, {});

    await Cart.findOneAndDelete({ user: req.user._id });
  }
  res.status(201).json({ status: 'success', data: order });
});

exports.createUserFilter = asyncHandler(async (req, res, next) => {
  if (req.user.role === 'user') req.filterObj = { user: req.user._id };
  next();
});

exports.getAllOrders = factory.getAllDocs(Order);

exports.getSpecificOrder = factory.getOneDocument(Order);

exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    return next(new ApiError(`no order in this id${req.param.orderId}`));
  }

  order.isPaid = true;
  order.paidAt = Date.now();

  const updateOrder = await order.save();
  res.status(200).json({ status: 'success', data: updateOrder });
});

exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    return next(new ApiError(`no order in this id${req.param.orderId}`));
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updateOrder = await order.save();
  res.status(200).json({ status: 'success', data: updateOrder });
});

exports.checkOutSession = asyncHandler(async (req, res, next) => {
  //Get User Cart
  const cart = await Cart.findOne({ user: req.user._id }); //req.params.cartId
  if (!cart) {
    return next(
      new ApiError(`this user haven't any cart : ${req.user._id}`, 404)
    );
  }
  const taxPrice = 0;
  const shippingPrice = 0;
  //Get total price if have coupone get total price after discount
  let totalPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  totalPrice = totalPrice + shippingPrice + taxPrice;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // name: req.user.name,
        // currency: "egp",
        // amount: totalPrice * 100,
        // quantity: 1,
        price_data: {
          currency: 'egp',
          unit_amount: totalPrice * 100,
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/orders`,
    cancel_url: `${req.protocol}://${req.get('host')}/cart`,
    customer_email: req.user.email,
    client_reference_id: cart._id,
    metadata: req.body.shippingAddress,
  });
  res.status(200).json({
    status: 'success',
    data: session,
  });
});

const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const orderPrice = session.amount_total / 100;

  const cart = await Cart.findById(cartId);
  const user = await User.findOne({ email: session.customer_email });

  const order = await Order.create({
    user: user._id,
    cartItems: cart.cartItems,
    totalOrderPrice: orderPrice,
    shippingAddress,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: 'card',
  });
  if (order) {
    const bulkOptions = cart.cartItems.map((cartItem) => ({
      updateOne: {
        filter: { _id: cartItem.product },
        update: {
          $inc: { quantity: -cartItem.quantity, sold: +cartItem.quantity },
        },
      },
    }));
    await Product.bulkWrite(bulkOptions, {});
    //5) delete cartItems
    await Cart.findByIdAndDelete(cartId);
  }
};

exports.webhochCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    createCardOrder(event.data.object);
  }
  res.status(200).json({ received: true });
});

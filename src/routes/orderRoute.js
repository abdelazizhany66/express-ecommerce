const express = require('express');
const {
  createCashOrder,
  getAllOrders,
  getSpecificOrder,
  createUserFilter,
  updateOrderToDelivered,
  updateOrderToPaid,
} = require('../services/orderService');
const { protect, allowedTo } = require('../services/authService');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(allowedTo('user'), createCashOrder)
  .get(allowedTo('user', 'admin', 'manager'), createUserFilter, getAllOrders);
router
  .route('/:id')
  .get(allowedTo('user', 'admin', 'manager'), getSpecificOrder);

router
  .route('/:orderId/pay')
  .put(allowedTo('admin', 'manager'), updateOrderToPaid);

router
  .route('/:orderId/deliver')
  .put(allowedTo('admin', 'manager'), updateOrderToDelivered);

module.exports = router;

const express = require('express');
const {
  addAddress,
  removeAddress,
  getAddressLogedUser,
} = require('../services/addressesService');
const { createAddress } = require('../utils/validator/addressesValidator');
const { protect, allowedTo } = require('../services/authService');

const router = express.Router();

router.use(protect, allowedTo('user'));
router.route('/').post(createAddress, addAddress).get(getAddressLogedUser);
router.delete('/:addressId', removeAddress);

module.exports = router;

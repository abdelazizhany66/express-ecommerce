const { check } = require('express-validator');

const User = require('../../models/userModel');
const validatorMiddleware = require('../../middleware/validatorMiddleware');

exports.createAddress = [
  check('postalCode')
    .isPostalCode('any')
    .withMessage('enter your postal code')
    .custom(async (val, { req }) => {
      const address = await User.findOne({
        'addresses.alias': req.body.alias,
        'addresses.postalCode': val,
      });
      console.log(address);
      if (address) {
        throw new Error('You already have an address with this alias and postal code');
      }
      return true;
    }),
  validatorMiddleware,
];

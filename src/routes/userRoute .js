const express = require('express');
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changePassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUser,
  activeLoggedUser,
} = require('../services/userService');
const {
  getUserValidator,
  createUserValidator,
  deleteUserValidator,
  updateUserValidator,
  changePasswordValidator,
  UpdateLoggedUserDataValidator,
} = require('../utils/validator/userValidator');
const { protect, allowedTo } = require('../services/authService');

const router = express.Router();

router.put('/activeMe/:id', activeLoggedUser);

router.use(protect);

router.get('/getMe', protect, getLoggedUserData, getUser);
router.put('/changePasswordMe', protect, updateLoggedUserPassword);
router.put('/updateMe', UpdateLoggedUserDataValidator, updateLoggedUserData);
router.delete('/deleteMe', deleteLoggedUser);

router.use(allowedTo('admin'));

router
  .route('/changePassword/:id')
  .put(changePasswordValidator, changePassword);
router
  .route('/')
  .post(uploadUserImage, resizeImage, createUserValidator, createUser)
  .get(getAllUsers);
router
  .route('/:id')
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;

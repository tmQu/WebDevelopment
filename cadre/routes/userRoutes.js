import express from 'express';
import userController, { uploadUserPhoto } from '../controllers/userController.js';
import authController from '../controllers/authController.js';

const router = express.Router();


router.post('/signup', authController.signup);

router.route('/login').post(authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.post('/verifyOTP', authController.verifyOTP);
router.patch('/resetPassword', authController.resetPassword);
router.patch('/updatePassword', authController.protect, authController.updatePassword);

router.patch(
  '/updateMe',
  authController.protect,
  uploadUserPhoto.single('photo'),
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router.route('/').get(userController.getAllUsers).post(userController.createUser);

router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

export default router;

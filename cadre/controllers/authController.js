import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import sendEmail from '../utils/email.js';
import crypto from 'crypto';

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true, // prevent cross site scripting attacks
    path: '/',
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined; // remove password from output

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: user,
    },
  });
};

const authController = {
  signup: async (req, res, next) => {
    try {
      const newUser = await User.create(req.body);
      createSendToken(newUser, 201, res);
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err,
      });
    }
  },
  login: async (req, res, next) => {
    const { email, password } = req.body;

    // 1. Check if email and password exists
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password!',
      });
    }

    // 2. Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password',
      });
    }

    // 3. If everything ok, send token to client and render home page
    createSendToken(user, 200, res);
  },
  protect: async (req, res, next) => {
    // 1. Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return new AppError('You are not logged in! Please log in to get access.', 401);
    }
    // 2. Verification token
    let decoded;
    try {
      decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    } catch (err) {
      return new AppError('Invalid token! Please log in again.', 401);
    }

    // 3. Check if user still exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return new AppError('The user belonging to this token does no longer exist.', 401);
    }

    // 4. Check if user changed password after the token was issued
    if (freshUser.changedPasswordAfter(decoded.iat)) {
      return new AppError('User recently changed password! Please log in again.', 401);
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = freshUser;
    next();
  },

  restrictTo: (...roles) => {
    return (req, res, next) => {
      // roles ['admin', 'super-admin']. role='user'
      if (!roles.includes(req.user.role)) {
        return new AppError('You do not have permission to perform this action', 403);
      }
      next();
    };
  },
  forgotPassword: async (req, res, next) => {
    // 1. Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'There is no user with this email address',
      });
    }
    // 2. Generate the OTP
    const otp = user.createPasswordResetToken(); // This function now generates an OTP
    await user.save({ validateBeforeSave: false });

    // 3. Send OTP to user's email
    const message = `Your password reset code is: ${otp}\nPlease use this code to reset your password on our site. It's valid for 10 minutes.\nIf you didn't request this, please ignore this email.`;
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset code (valid for 10 min)',
        message,
      });

      res.status(200).json({
        status: 'success',
        message: 'Password reset code sent to email!',
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      next(new AppError('There was an error sending the email. Try again later!'), 500);
      // return res.status(500).json({
      //   status: 'fail',
      //   message: err,
      // });
    }
  },
  verifyOTP: catchAsync(async (req, res, next) => {
    try {
      // 1. Hash the provided OTP
      const hashedOtp = crypto
        .createHash('sha256')
        .update(req.body.otp) // Assuming OTP is sent in the body of the request
        .digest('hex');

      // 2. Find user based on the hashed OTP and check if it hasn't expired
      const user = await User.findOne({
        passwordResetToken: hashedOtp,
        passwordResetExpires: { $gt: Date.now() },
      });
      console.log("Ok");
      // 3. If OTP is valid and there is a user, set the new password
      createSendToken(user, 200, res);
    } catch (err) {
      // return next(new AppError('OTP is invalid or has expired', 400));
      return res.status(400).json({
        status: 'fail',
        message: 'OTP is invalid or has expired',
      });
    }
  }),
  resetPassword: catchAsync(async (req, res, next) => {
    let token;
    if (req.cookies.jwt) token = req.cookies.jwt;
    if (!token) {
      return new AppError('Cannot authorize you', 401);
    }
    console.log(token);
    let decoded;
    try {
      decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    } catch (err) {
      return new AppError('Invalid token! Please log in again.', 401);
    }

    // Fetch user from database
    const user = await User.findById(decoded.id);
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // 4. Update changedPasswordAt property for the user
    user.passwordChangedAt = Date.now();

    await user.save({ validateBeforeSave: false });
    // 5. Log the user in, send JWT
    createSendToken(user, 200, res);
  }),
  updatePassword: catchAsync(async (req, res, next) => {
    // 1. Get user from collection
    const user = await User.findById(req.user._id).select('+password');

    // 2. Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
      return next(new AppError('Your current password is wrong.', 401));
    }
    // 3. If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // 4. Log user in, send JWT
    createSendToken(user, 200, res);
  }),
};

export default authController;

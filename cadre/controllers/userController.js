import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import multer from 'multer'; // for uploading files
import sharp from 'sharp'; // image processing library

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'static/img/users');
//   },
//   filename: (req, file, cb) => {
//     // user-123abc123abc123abc-1234567890.jpeg
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage(); // store image as buffer

const multerFilter = (req, file, cb) => {
  // only accept image files
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

export { upload as uploadUserPhoto };

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
          users,
        },
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err,
      });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err,
      });
    }
  },
  createUser: async (req, res) => {
    try {
      const newUser = await User.create(req.body);
      res.status(201).json({
        status: 'success',
        data: {
          user: newUser,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err,
      });
    }
  },
  updateUser: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err,
      });
    }
  },
  deleteUser: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(204).json({
        status: 'success',
        data: null,
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err,
      });
    }
  },
  updateMe: catchAsync(async (req, res, next) => {
    // 1 Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /updatePassword',
          400
        )
      );
    }

    // 2 Filtered out unwanted fields names that are not allowed to be updated
    const filterBody = filterObj(
      req.body,
      'name',
      'email',
      'phoneNumber',
      'dateOfBirth'
    );

    if (req.file) filterBody.photo = req.file.filename;

    // 3 Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user._id, filterBody, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  }),
  deleteMe: async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { active: false });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  },
  resizeUserPhoto: catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`static/img/users/${req.file.filename}`);

    next();
  }),
};

export default userController;

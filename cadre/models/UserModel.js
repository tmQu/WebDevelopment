import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Please tell us your date of birth!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email!'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide your phone number!'],
    unique: true,
    validate: [validator.isMobilePhone, 'Please provide a valid phone number!'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    level: {
      type: String,
      enum: ['wards', 'districts', 'departmental'],
    },
    detail: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'role.level',
      default: null,
    },
  },
  password: {
    type: String,
    required: [true, 'Please provide your password!'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password!'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password') || this.isNew) return next();

  // -1000 to make sure the token is always created after the password is changed
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10 // base 10
    );
    // console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash the OTP and store it in the database
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');

  // Set expiration time (10 minutes)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return otp;
};

const User = mongoose.model('users', userSchema);

export default User;

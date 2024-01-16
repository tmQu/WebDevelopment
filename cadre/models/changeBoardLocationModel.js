import mongoose from 'mongoose';

const changeBoardLocationSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    addr: {
      district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'districts',
        required: true,
      },
      ward: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'wards',
        required: true,
      },
      route: {
        type: String,
        required: true,
      },
      street_number: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
    },
    imgBillboardLocation: [
      {
        type: String,
        required: true,
      },
    ],
    location: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    locationCategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'location_categories',
        required: true,
      },
    ],
    boardLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'board_locations',
      required: true,
    },
    advertisementForm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'advertisement_forms',
      required: true,
    },
    status: {
      type: Number,
      default: 0,
    },
    reason: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

changeBoardLocationSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'advertisementForm',
    select: 'advertisementForm',
  })
    .populate({
      path: 'locationCategory',
      select: 'locationCategory',
    })
    .populate({
      path: 'addr.district',
      select: 'district',
    })
    .populate({
      path: 'addr.ward',
      select: 'ward',
    });
  next();
});

const changeBoardLocationModel = mongoose.model('change_board_location', changeBoardLocationSchema);

export default changeBoardLocationModel;

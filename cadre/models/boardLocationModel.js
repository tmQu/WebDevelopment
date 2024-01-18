import mongoose from 'mongoose';

let BillboardLocationSchema = new mongoose.Schema({
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

  addr: {
    street_number: {
      type: String,
      required: true,
    },
    route: {
      type: String,
      required: true,
    },
    ward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'wards',
      required: true,
    },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'districts',
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },

  isPlan: {
    type: Boolean,
    default: false,
  },

  advertisementForm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'advertisement_forms',
    required: true,
  },

  locationCategory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'location_categories',
    },
  ],

  imgBillboardLocation: {
    type: Array,
    required: true,
  },
  num_board: {
    type: Number,
    default: 0
  }
});

BillboardLocationSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'addr.ward',
    select: 'ward',
  }).populate({
    path: 'addr.district',
    select: 'district',
  }).populate({
    path: 'advertisementForm',
    select: 'advertisementForm',
  }).populate({
    path: 'locationCategory',
    select: 'locationCategory',
  });
  next();
});

const boardLocationModel = mongoose.model('board_locations', BillboardLocationSchema);

export default boardLocationModel;
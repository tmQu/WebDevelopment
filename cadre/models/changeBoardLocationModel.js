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
      }
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
      }
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
    isDelete: {
      type: Boolean,
      default: false,
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

const changeBoardLocationModel = mongoose.model('change_board_location', changeBoardLocationSchema);

export default changeBoardLocationModel;
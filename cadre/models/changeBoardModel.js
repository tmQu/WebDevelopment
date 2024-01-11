import mongoose from 'mongoose';

const changeBoardSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  imgBillboard: {
    type: String,
    required: true,
  },
  boardType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'board_types',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  isDelete: {
    type: Boolean,
    default: false,
  },
  reason: {
    type: String,
    required: true,
  },
  locationCategory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'location_categories',
    },
  ],
  advertisementForm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'advertisement_forms',
    required: true,
  },
  imgBillboardLocation: [
    {
      type: String,
      required: true,
    },
  ],
});

const changeBoardModel = mongoose.model('change_board', changeBoardSchema);

export default changeBoardModel;

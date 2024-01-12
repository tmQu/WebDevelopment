import mongoose from 'mongoose';

const changeBoardSchema = new mongoose.Schema(
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
    imgBillboard: {
      type: String,
      required: true,
    },
    boardType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'board_types',
      required: true,
    }, 
    boardLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'board_locations',
      required: true,
    },  
    quantity: {
      type: String,
      required: true,
    },
    size: {
      type: String,
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

const changeBoardModel = mongoose.model('change_board', changeBoardSchema);

export default changeBoardModel;
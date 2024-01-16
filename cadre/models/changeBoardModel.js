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
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'boards',
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

changeBoardSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'boardType',
    select: 'boardType',
  });
  next();
});

const changeBoardModel = mongoose.model('change_board', changeBoardSchema);

export default changeBoardModel;
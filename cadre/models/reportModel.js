import mongoose from 'mongoose';

const reportModel = mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
    },

    sender: {
      fullname: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },

    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'boards',
      //required: true
    },

    method: {
      //get reportMethod value, not id from reportMethodModel
      type: String,
      ref: 'report_method',
      //required: true
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    description: {
      type: String,
      required: true,
    },

    status: {
      type: Boolean,
      default: 0, //0: processing, 1: done
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Report = mongoose.model('reports', reportModel);

export default Report;

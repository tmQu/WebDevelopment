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
      type: String,
      enum: ['Đang xử lý', 'Đã xử lý'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Report = mongoose.model('reports', reportModel);

export default Report;

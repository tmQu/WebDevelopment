import mongoose from 'mongoose';

const reportMethodModel = new mongoose.Schema(
  {
    reportMethod: {
      type: String,
      required: true,
    },
    // Danh sách các bước xử lý
    steps: [
      {
        type: String,
        required: false
      },
    ],
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

const reportMethod = mongoose.model('report_methods', reportMethodModel);

export default reportMethod;

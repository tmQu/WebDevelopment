import mongoose from 'mongoose';

const reportModel = mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
    },

    location: {
      lat: {
      type: Number,
      require: true,
      },
      lng: {
      type: Number,
      require: true,
      },
    },

    ward: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "wards",
        required: true,
    },
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "districts",
        required: true,
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
    },

    method: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'report_method',
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

reportModel.pre(/^find/, function (next) {
  this.populate({
    path: 'method',
    select: 'reportMethod',
  });
  next();
});


const Report = mongoose.model('reports', reportModel);

export default Report;

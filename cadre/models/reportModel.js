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
      required: true,
      },
      lng: {
      type: Number,
      required: true,
      },
    },
    addr: {
      type: String
    },
    ward: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "wards"
    },
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "districts"
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
      ref: 'report_methods',
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
      type: Number,
      default: -1,
    },
    officer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    handleDetails: {
      type: String,
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
    select: 'reportMethod steps',
  }).populate({
    path: 'board',
    select: 'boardLocation',
  });
  
  next();
});


const Report = mongoose.model('reports', reportModel);

export default Report;

import mongoose from 'mongoose';

let BillboardLocationSchema = new mongoose.Schema({
  id: {
    type: String,
    require: true,
    unique: true,
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

  addr: {
    street_number: {
      type: String,
      require: true,
    },
    route: {
      type: String,
      require: true,
    },
    ward: {
      type: String,
      require: true,
    },
    district: {
      type: String,
      require: true,
    },
    city: {
      type: String,
      require: true,
    },
  },

  isPlan: {
    type: Boolean,
    require: true,
  },

  advertisementForm: {
    type: String,
    require: true,
  },

  locationCategory: {
    type: Array,
    require: true,
  },

  billboards: [
    {
      idBillboard: {
        type: String,
        require: true,
      },
      imgBillboard: {
        type: String,
        require: true,
      },
      size: {
        type: String,
        require: true,
      },
      billboardType: {
        type: String,
        require: true,
      },
      expireDate: {
        // date with iso8601 format
        type: Date,
        require: true,
        default: Date.now,
      },
    },
  ],

  imgBillboardLocation: {
    type: String,
    require: true,
  },
});

const boardModel = mongoose.model('boards', BillboardLocationSchema);

export default boardModel;
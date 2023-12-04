import mongoose from "mongoose";

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
    type: String,
    require: true,
  },
});

const boardModel = mongoose.model("Board", BillboardLocationSchema);

export default boardModel;

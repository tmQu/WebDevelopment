import mongoose from 'mongoose';

const districtSchema = new mongoose.Schema({
  district: {
    type: String,
    required: true,
  },
});

const districtModel = mongoose.model('districts', districtSchema);
export default districtModel;
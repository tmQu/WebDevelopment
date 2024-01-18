import mongoose from 'mongoose';

const wardSchema = new mongoose.Schema({
    district: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'districts', 
        required: true
    },
    ward: {
        type: String,
        required: true,
    }
});

const wardModel = mongoose.model("wards", wardSchema); 
export default wardModel;
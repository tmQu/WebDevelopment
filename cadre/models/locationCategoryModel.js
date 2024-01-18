import mongoose from 'mongoose';

const locationCategorySchema = new mongoose.Schema({
    locationCategory: {
        type: String,
        required: true,
    }
}); 



const locationCategoryModel = mongoose.model("location_categories", locationCategorySchema);
export default locationCategoryModel;
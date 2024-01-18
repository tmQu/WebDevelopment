import mongoose from 'mongoose';

const advtFormSchema = new mongoose.Schema({
    advertisementForm: {
        type: String,
        required: true
    }
});

const advFormModel = mongoose.model("advertisement_forms", advtFormSchema);

export default advFormModel;
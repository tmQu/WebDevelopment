import mongoose from 'mongoose';

const reportMethodModel = new mongoose.Schema({
    reportMethod: {
        type: String,
        required: true
    },
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

const reportMethod = mongoose.model('report_method', reportMethodModel);

export default reportMethod;
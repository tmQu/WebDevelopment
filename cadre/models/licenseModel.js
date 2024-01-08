import mongoose from 'mongoose';

const licenseSchema = new mongoose.Schema({
    board: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    imgBoard: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    company:{
        infor: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        addr: {
            type: String,
            required: true
        },

    },
    period: {
        start_date: {
            type: Date,
            required: true
        },
        end_date: {
            type: Date,
            required: true
        }
    },
    status: {
        type: String,
        required: true,
    }
});

const licenseModel = mongoose.model("licenses", licenseSchema);
export default licenseModel;
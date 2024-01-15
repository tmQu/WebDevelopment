import mongoose from 'mongoose';

const licenseSchema = new mongoose.Schema({
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'boards',
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
    createAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    approve: {
        type: Boolean
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    }
});

const licenseModel = mongoose.model("licenses", licenseSchema);
export default licenseModel;
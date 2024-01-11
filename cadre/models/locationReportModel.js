import mongoose from "mongoose";

const locationReportSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now(),
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

    ward: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "wards",
        required: true,
    },
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "districts",
        required: true,
    },
});

const LocationReport = mongoose.model("LocationReport", locationReportSchema);

export default LocationReport;

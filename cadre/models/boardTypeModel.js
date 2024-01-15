import mongoose from 'mongoose';

const boardTypeSchema = new mongoose.Schema({
    boardType: {
        type: String,
        require: true
    }
});

const boardTypeModel = mongoose.model("board_types", boardTypeSchema);

export default boardTypeModel;
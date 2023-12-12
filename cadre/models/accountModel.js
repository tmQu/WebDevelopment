import mongoose from 'mongoose';

let AccountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        required: true,
    },
});

const accountModel = mongoose.model('accounts', AccountSchema);

export default accountModel;
import mongoose from "mongoose";

var UserSchema = mongoose.Schema({
    idUser: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    pwd : {
        type: String,
        required: true
    },
    role: {
        type: Object,
        required: true
    }
})

const User = mongoose.model('user', UserSchema);



export default User






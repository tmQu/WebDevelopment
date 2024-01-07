import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    id : { type: Number, required: true, unique: true },
    name : { type: String, required: true },
    price : { type: Number, required: true },
    description : { type: String, required: true },
    image: { type: String, required: true }
},{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

const productModel = mongoose.model("products", productSchema);

export default productModel;
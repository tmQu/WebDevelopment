import productModel from "../models/productModel.js";

const productControllers = {
    getAllProducts: async (req, res) => {
        try {
            const products = await productModel.find({});
            //res.json(products);
            return products;
        } catch (error) {
            console.log(error);
        }
    },
    getProductById: async (req, res) => {
        try {
            const product = await productModel.findOne({ id: req.params.id });
            res.json(product);
        } catch (error) {
            console.log(error);
        }
    },
    createProduct: async (req, res) => {
        try {
            const newProduct = await productModel.create(req.body);
            res.json(newProduct);
        } catch (error) {
            console.log(error);
        }
    },
    updateProduct: async (req, res) => {
        try {
            const updatedProduct = await productModel.findOneAndUpdate(
                { id: req.params.id },
                req.body,
                { new: true }
            );
            res.json(updatedProduct);
        } catch (error) {
            console.log(error);
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const deletedProduct = await productModel.findOneAndDelete({ id: req.params.id });
            res.json(deletedProduct);
        } catch (error) {
            console.log(error);
        }
    }
}

export default productControllers;
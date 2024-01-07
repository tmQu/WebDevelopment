import productControllers from "../controllers/productController.js";
import express from "express";

const router = express.Router();

const productRoutes = () => {
    router.get("/", productControllers.getAllProducts);
    router.get("/:id", productControllers.getProductById);
    router.post("/", productControllers.createProduct);
    router.patch("/:id", productControllers.updateProduct);
    router.delete("/:id", productControllers.deleteProduct);

    return router;
}

export default productRoutes;
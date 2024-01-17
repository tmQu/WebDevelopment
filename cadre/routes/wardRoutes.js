import wardController from "../controllers/wardController.js";
import express from "express";

const router = express.Router();

router
    .route('/')
    .get(wardController.getOfDistrict)
    .post(wardController.create);

router
    .route('/:id')
    .get(wardController.getById)
    .patch(wardController.update)
    .delete(wardController.remove);

export default router;
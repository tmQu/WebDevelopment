import districtController from "../controllers/districtController.js";
import express from "express";

const router = express.Router();

router
    .route("/")
    .get(districtController.getAll)
    .post(districtController.create);

router
    .route("/:id")
    .get(districtController.getById)
    .patch(districtController.update)
    .delete(districtController.remove);

export default router;
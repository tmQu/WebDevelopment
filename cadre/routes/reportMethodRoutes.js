import reportMethodController from "../controllers/reportMethodController.js";
import express from "express";

const router = express.Router();

router
    .route("/")
    .get(reportMethodController.getAllMethods)
    .post(reportMethodController.createMethod);

router
    .route("/:id")
    .get(reportMethodController.getByID);

export default router;
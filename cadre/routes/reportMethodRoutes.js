import reportMethodController from "../controllers/reportMethodController.js";
import express from "express";

const router = express.Router();

router
    .route("/")
    .get(reportMethodController.getAllMethods)
    .post(reportMethodController.createMethod);

router
    .route("/:id")
    .get(reportMethodController.getByID)
    .patch(reportMethodController.updateMethod)
    .delete(reportMethodController.deleteMethod);

export default router;
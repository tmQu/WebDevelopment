import advFormController from "../controllers/advFormController.js";
import express from "express";

const router = express.Router();

router
    .route("/")
    .get(advFormController.getAll)
    .post(advFormController.create);

router
    .route("/:id")
    .get(advFormController.getByID)
    .patch(advFormController.update)
    .delete(advFormController.remove);

export default router;
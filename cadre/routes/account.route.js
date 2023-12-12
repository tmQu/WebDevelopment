import express from "express";
import { accountController } from "../controllers/account.controller.js";

const router = express.Router();

router
    .route("/")
    .get(accountController.getAllAccounts)
    .post(accountController.createAccount);

router
    .route("/:id")
    .get(accountController.getById)
    .patch(accountController.updateAccount)
    .delete(accountController.deleteAccount);

export default router;
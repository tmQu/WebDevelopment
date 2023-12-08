import boardController from "../controllers/boardController.js";
import express from "express";

const router = express.Router();

router
  .route("/")
  .get(boardController.getAllBoards)
  .post(boardController.createBoard);

router
  .route("/:id")
  .get(boardController.getById)
  .patch(boardController.updateBoard)
  .delete(boardController.deleteBoard);

router
  .route("/test"), (req, res) => {
    console.log(req.body);
  }

export default router;

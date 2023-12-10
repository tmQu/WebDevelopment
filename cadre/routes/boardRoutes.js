import boardController from '../controllers/boardController.js';
import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router
  .route('/')
  .get(authController.protect, boardController.getAllBoards)
  .post(boardController.createBoard);

router
  .route('/:id')
  .get(boardController.getById)
  .patch(boardController.updateBoard)
  .delete(
    authController.protect,
    authController.restrictTo('super-admin'),
    boardController.deleteBoard
  );

export default router;

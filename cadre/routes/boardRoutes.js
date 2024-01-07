import boardController from '../controllers/boardController.js';
import authController from '../controllers/authController.js';
import express from 'express';

const router = express.Router();

router
  .route('/')
  .get(boardController.getAllBoardLocation)
  .post(boardController.createBoard);

router
  .route('/detail/:id')
  .get(boardController.getBoardInLocation)
router
  .route('/:id')
  .get(boardController.getBoardLocationWithId)
  .patch(boardController.updateBoard)
  .delete(
    authController.protect,
    authController.restrictTo('super-admin'),
    boardController.deleteBoard
  );

router
  .route('/account/:id')
  .get(boardController.getByAccount);

export default router;

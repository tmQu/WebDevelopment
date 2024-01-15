import boardController from '../controllers/boardController.js';
import authController from '../controllers/authController.js';
import express from 'express';

const router_v1 = express.Router();
const router_v2 = express.Router();

router_v1.route('/').get(boardController.getAllBoardLocation).post(boardController.createBoard);

router_v1.route('/detail/:id').get(boardController.getBoardInLocation);

router_v1
  .route('/:id')
  .get(boardController.getBoardLocationWithId)
  .patch(boardController.updateBoard)
  .delete(authController.protect, authController.restrictTo('super-admin'), boardController.deleteBoard);

router_v1.route('/account/:id').get(boardController.getByAccount);

router_v2.route('/').get(boardController.viewBoard);

const router = {
  router_v1,
  router_v2,
};

export default router;

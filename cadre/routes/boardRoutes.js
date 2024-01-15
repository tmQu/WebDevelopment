import boardController from '../controllers/boardController.js';
import authController from '../controllers/authController.js';
import express from 'express';


// router_v1 -> render, cadre
// router_v2 -> json, resdient
const router_v1 = express.Router();
const router_v2 = express.Router();  
  
router_v1
  .route('/:id')
  .get(authController.protect,
    boardController.getBoardLocationWithId)

  .patch(    
    authController.protect,
    authController.restrictTo('super-admin'),
    boardController.updateBoard)

  .delete(
    authController.protect,
    authController.restrictTo('super-admin'),
    boardController.deleteBoard
  );

router_v1.route('/').get(boardController.viewBoard);

// router_v1
//   .route('/account/:id')
//   .get(boardController.getByAccount);


router_v2
  .route('/')
  .get(boardController.getAllBoardLocation)
  .post(boardController.createBoard);

router_v2
  .route('/detail/:id')
  .get(boardController.getBoardInLocation);






export default {router_v1, router_v2};

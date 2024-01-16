import boardController from '../controllers/boardController.js';
import authController from '../controllers/authController.js';
import express from 'express';
import { upload } from '../utils/imgHandler.js';


// router_v1 -> render, cadre
// router_v2 -> json, resdient
const router_v1 = express.Router();
const router_v2 = express.Router();  
  
router_v1
  .route('/:id')
  .get(authController.protect,
    boardController.getBoardLocationWithId)

router_v1.route('/update/:id')
    .post(    
    authController.protect,
    authController.restrictTo('departmental'),
    upload.single('imgBillboard'),
    boardController.updateBoard)

router_v1.route('/add')
.post(    
  authController.protect,
  authController.restrictTo('departmental'),
  upload.single('imgBillboard'),
  boardController.createBoard)

router_v1.route('/delete/:id')
  .get(
    authController.protect,
    authController.restrictTo('departmental'),
    boardController.deleteBoard
  )



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

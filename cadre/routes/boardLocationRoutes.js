import express from 'express'
import boardLocationController from '../controllers/boardLocationController.js';
import {upload} from '../utils/imgHandler.js'
import authController from '../controllers/authController.js';

const router_v1 = express.Router();
const router_v2 = express.Router();

router_v1.route('/update/:id')
.post(    
    authController.protect,
    authController.restrictTo('departmental'),
    upload.array('imgBillboardLocation', 3),
    boardLocationController.updateBoardLocation)

router_v1.route('/add')
.post(
    authController.protect,
    authController.restrictTo('departmental'),
    upload.array('imgBillboardLocation', 3),
    boardLocationController.createBoardLocation)


router_v1.route('/delete/:id')
.get(
    authController.protect,
    authController.restrictTo('departmental'),
    boardLocationController.deleteBoardLocation)

export default {router_v1, router_v2}
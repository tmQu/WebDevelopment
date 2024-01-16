import changeBoardController from '../controllers/changeBoardController.js';
import express from 'express';
import { upload } from '../utils/imgHandler.js';

const router_v1 = express.Router();
const router_v2 = express.Router();

router_v2.route('/').post(upload.single('imgBillboard'), changeBoardController.createChangeInfoReq);

const router = {
  router_v1,
  router_v2,
};

export default router;

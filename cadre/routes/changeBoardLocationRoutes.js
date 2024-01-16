import changeBoardLocationController from '../controllers/changeBoardLocationController.js';
import express from 'express';
import { upload } from '../utils/imgHandler.js';

const router_v1 = express.Router();
const router_v2 = express.Router();

router_v1
  .route('/')
  .post(upload.array('imgBillboardLocation', 3), changeBoardLocationController.createChangeBoardLocationReq);

const router = {
  router_v1,
  router_v2,
};

export default router;

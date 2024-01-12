import changeBoardController from '../controllers/changeBoardController.js';
import express from 'express';
import { upload } from '../utils/imgHandler.js';

const router = express.Router();

router.post('/', upload.single('imgBillboard'), changeBoardController.createChangeInfoReq);

export default router;

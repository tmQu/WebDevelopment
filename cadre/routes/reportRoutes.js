import reportController from '../controllers/reportController.js';
import express from 'express';
import {upload} from '../utils/imgHandler.js';

// router_v1 -> render, cadre
// router_v2 -> json, resdient
const router_v1 = express.Router();
const router_v2 = express.Router();  

// cadre
router_v1
  .route('/:id')
  .get(reportController.getByID_v1)
  .patch(reportController.updateReport)
  .delete(reportController.deleteReport);

router_v1.route('/sendEmail').post(reportController.sendEmailToReporter);



// resident
router_v2.route('/')
  .get(reportController.getAllReports)
  .post(upload.array('images', 2), reportController.createReport);

router_v2.route('/:id')
  .get(reportController.getByID_v2);

export default {router_v1, router_v2};

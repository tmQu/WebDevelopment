import reportController from '../controllers/reportController.js';
import express from 'express';
import { upload } from '../utils/imgHandler.js';

const router = express.Router();

router.route('/').get(reportController.getAllReports).post(upload.array('images', 2), reportController.createReport);

router
  .route('/:id')
  .get(reportController.getByID)
  .patch(reportController.updateReport)
  .delete(reportController.deleteReport);

router.route('/sendEmail').post(reportController.sendEmailToReporter);
export default router;

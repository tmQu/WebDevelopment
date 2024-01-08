import reportController from '../controllers/reportController.js';
import express from 'express';

const router = express.Router();

router.route('/').get(reportController.getAllReports).post(reportController.createReport);

router
  .route('/:id')
  .get(reportController.getByID)
  .patch(reportController.updateReport)
  .delete(reportController.deleteReport);

router.route('/sendEmail').post(reportController.sendEmailToReporter);
export default router;

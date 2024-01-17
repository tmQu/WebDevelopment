import express from 'express';
import licenseController from '../controllers/licenseController.js';
import { upload } from '../utils/imgHandler.js';
import authController from '../controllers/authController.js';
const router = express.Router();

router.route('/approve/:id')
    .post(authController.protect, authController.restrictTo('departmental'),licenseController.approveLicense);

router.route('/delete/:id')
    .post(authController.protect, authController.restrictTo('departmental'),licenseController.deleteLicense);


router.route('/list')
    .get(authController.protect ,licenseController.renderLicenseList)

router.route('/form/:id')
    .get(authController.protect, authController.restrictTo('wards', 'districts'),licenseController.renderLicenseForm)
    .post(upload.single('imgBoard'),licenseController.createLicense);

router.route('/')
    .get(licenseController.renderDetailForm)



export default router;
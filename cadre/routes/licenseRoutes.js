import express from 'express';
import licenseController from '../controllers/licenseController.js';
import { upload } from '../utils/imgHandler.js';

const router = express.Router();

router.route('/approve/:id')
    .post(licenseController.approveLicense);

router.route('/delete/:id')
    .post(licenseController.deleteLicense);


router.route('/list')
    .get(licenseController.renderLicenseList)


router.route('/form/:id')
    .get(licenseController.renderLicenseForm)
    .post(upload.single('imgBoard'),licenseController.createLicense);

router.route('/')
    .get(licenseController.renderDetailForm)



export default router;
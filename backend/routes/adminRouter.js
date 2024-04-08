import express from 'express';
import { deleteCompanyRequest, loginAdmin, logoutAdmin, registerAdmin, sendGeneralNotification, sendNotificationOnJobUpdate, updatePassword, verifyCompany, viewAllCompanyRequests } from '../controllers/adminController.js';
import { isAdminLoggedIn } from '../middlewares/adminAuth.js';

const router = express.Router();

router.route('/register').post(registerAdmin);
router.route('/login').post(loginAdmin);
router.route('/logout').get(isAdminLoggedIn, logoutAdmin);
router.route('/verify/:req_id').put(isAdminLoggedIn, verifyCompany);
router.route('/delete/:req_id').delete(isAdminLoggedIn, deleteCompanyRequest);
router.route('/update-password').post(isAdminLoggedIn, updatePassword);
router.route('/job-notif/:job_id').post(isAdminLoggedIn, sendNotificationOnJobUpdate);
router.route('/send-general-notif').post(isAdminLoggedIn, sendGeneralNotification);
router.route('/all-requests').get(isAdminLoggedIn, viewAllCompanyRequests);

export default router;
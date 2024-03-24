import express from 'express';
import { deleteCompanyRequest, loginAdmin, logoutAdmin, registerAdmin, sendGeneralNotification, sendNotificationOnJobUpdate, updatePassword, verifyCompany } from '../controllers/adminController.js';
import { isAdminLogggedIn } from '../middlewares/isAdminLoggedIn.js';

const router=express.Router();

router.route('/register').post(registerAdmin);
router.route('/login').post(loginAdmin);
router.route('/logout').get(isAdminLogggedIn, logoutAdmin);
router.route('/verify/:req_id').post(isAdminLogggedIn, verifyCompany);
router.route('/delete/:req_id').delete(isAdminLogggedIn, deleteCompanyRequest);
router.route('/update-password').put(isAdminLogggedIn,updatePassword);
router.route('/send-notif').post(isAdminLogggedIn,sendNotificationOnJobUpdate);
router.route('/send-general-notif').post(isAdminLogggedIn,sendGeneralNotification);

export default router;
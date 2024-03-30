import express from 'express';
import { getGeneralNotif, getJobPostNotification } from '../controllers/notificationController.js';

const router = express.Router();

router.route('/job-post').get(getJobPostNotification);
router.route('/general').get(getGeneralNotif);

export default router;
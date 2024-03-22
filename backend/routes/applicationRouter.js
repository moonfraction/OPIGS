import express from 'express';
import {employerGetAllApplications, jobSeekerGetAllApplications, jobSeekerDeleteApplication, postApplication} from "../controllers/applicationController.js";
import {isAuthorized} from "../middlewares/auth.js";

const router = express.Router();

router.get('/employer/all', isAuthorized, employerGetAllApplications);
router.get('/job-seeker/all', isAuthorized, jobSeekerGetAllApplications);
router.delete('/delete/:id', isAuthorized, jobSeekerDeleteApplication);
router.post('/post', isAuthorized, postApplication);
export default router;
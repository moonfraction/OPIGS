import express from 'express';
import {getAllJobs, postJob, getMyJobs, updateJob, deleteJob, getJobDetails} from "../controllers/jobController.js";
import {isAuthorized} from "../middlewares/auth.js";
import { isCompanyVerified } from '../middlewares/verification.js';
const router = express.Router();

router.get('/all', getAllJobs);
router.post('/post', isAuthorized, isCompanyVerified, postJob);
router.get('/myjobs', isAuthorized, isCompanyVerified, getMyJobs);
router.put('/update/:id', isAuthorized, isCompanyVerified, updateJob);
router.delete('/delete/:id', isAuthorized, isCompanyVerified, deleteJob);
router.get('/:id', isAuthorized, isCompanyVerified, getJobDetails);

export default router;
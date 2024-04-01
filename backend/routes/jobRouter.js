import express from 'express';
import {getAllJobs, postJob, getMyJobs, updateJob, deleteJob, getJobDetails, getJobsByCompanyId} from "../controllers/jobController.js";
import { isCompanyLoggedIn, isCompanyLoggedInandVerified } from '../middlewares/companyAuth.js';
const router = express.Router();

router.get('/alljobs', getAllJobs);
router.post('/post', isCompanyLoggedInandVerified, postJob);
router.get('/myjobs', isCompanyLoggedInandVerified, getMyJobs);
router.put('/update/:id', isCompanyLoggedInandVerified, updateJob);
router.delete('/delete/:id', isCompanyLoggedInandVerified, deleteJob);
router.route("/getjobs").get(isCompanyLoggedIn, getJobsByCompanyId);
router.get('/:id', getJobDetails);

export default router;
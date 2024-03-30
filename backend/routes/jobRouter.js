import express from 'express';
import {getAllJobs, postJob, getMyJobs, updateJob, deleteJob, getJobDetails} from "../controllers/jobController.js";
import { isCompanyLoggedInandVerified } from '../middlewares/companyAuth.js';
const router = express.Router();

router.get('/alljobs', getAllJobs);
router.post('/post', isCompanyLoggedInandVerified, postJob);
router.get('/myjobs', isCompanyLoggedInandVerified, getMyJobs);
router.put('/update/:id', isCompanyLoggedInandVerified, updateJob);
router.delete('/delete/:id', isCompanyLoggedInandVerified, deleteJob);
router.get('/:id', getJobDetails);

export default router;
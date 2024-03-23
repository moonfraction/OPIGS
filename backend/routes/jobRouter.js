import express from 'express';
import {getAllJobs, postJob, getMyJobs, updateJob, deleteJob, getJobDetails} from "../controllers/jobController.js";
import {isAuthorized} from "../middlewares/auth.js";
const router = express.Router();

router.get('/all', getAllJobs);
router.post('/post', isAuthorized, postJob);
router.get('/myjobs', isAuthorized, getMyJobs);
router.put('/update/:id', isAuthorized, updateJob);
router.delete('/delete/:id', isAuthorized, deleteJob);
router.get('/:id', getJobDetails);

export default router;
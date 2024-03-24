import express from 'express';
import {upload} from '../middlewares/multer.js';
import { isAuthorized } from '../middlewares/auth.js';
import { studentGetAllApplications, postApplication, studentDeleteApplication , companyGetAllApplications, companyGetSingleApplication, companyChangeApplicationStatus, getApprovedApplications} from '../controllers/applicationController.js';

const router = express.Router();

router.route("/post").post(
    upload.fields([
        {name: "resume", maxCount: 1}
    ]),
    isAuthorized,
    postApplication
);
router.route("/delete/:id").delete(isAuthorized,studentDeleteApplication);
router.route("/student").get(isAuthorized,studentGetAllApplications);
router.route("/company").get(isAuthorized,companyGetAllApplications);
router.route("/company/:id").get(isAuthorized,companyGetSingleApplication);
router.route("/company/:id/status").put(isAuthorized,companyChangeApplicationStatus);
router.route("/approved").get(isAuthorized,getApprovedApplications);

export default router;
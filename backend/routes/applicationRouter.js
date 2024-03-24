import express from 'express';
import {upload} from '../middlewares/multer.js';
import { studentGetAllApplications, postApplication, studentDeleteApplication , companyGetAllApplications, companyGetSingleApplication, companyChangeApplicationStatus, getApprovedApplications} from '../controllers/applicationController.js';
import { isStudentLoggedIn } from '../middlewares/studentAuth.js';
import { isCompanyLoggedInandVerified } from '../middlewares/companyAuth.js';

const router = express.Router();

router.route("/post").post(
    upload.fields([
        {name: "resume", maxCount: 1}
    ]),
    isStudentLoggedIn,
    postApplication
);
router.route("/delete/:id").delete(isStudentLoggedIn,studentDeleteApplication);
router.route("/student").get(isStudentLoggedIn,studentGetAllApplications);
router.route("/company").get(isCompanyLoggedInandVerified,companyGetAllApplications);
router.route("/company/:id").get(isCompanyLoggedInandVerified,companyGetSingleApplication);
router.route("/company/:id/status").put(isCompanyLoggedInandVerified,companyChangeApplicationStatus);
router.route("/approved").get(isStudentLoggedIn,getApprovedApplications);

export default router;
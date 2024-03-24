import express from 'express';
import { upload } from '../middlewares/multer.js';
import {isAuthorized} from "../middlewares/auth.js";
import { registerCompany,loginCompany, logoutCompany, getCompanyProfile, updateCompanyProfile, changePassword, applyForVerification, getAllStudents, getOneStudent} from '../controllers/companyController.js';
const router = express.Router();
import { isCompanyVerified } from '../middlewares/verification.js';

router.route("/register").post(
    upload.fields([
        {name: "logo", maxCount: 1}
    ]),
    registerCompany
);
router.route("/login").post(loginCompany);
router.route("/logout").post(isAuthorized, logoutCompany);
router.route("/details").get(isAuthorized, getCompanyProfile);
router.route("/update").put(isAuthorized,upload.fields
    ([
        {name: "logo", maxCount: 1}
    ]),updateCompanyProfile
    );
router.route("/changePassword").post(isAuthorized, changePassword);
router.route("/apply").post(isAuthorized, applyForVerification);
router.route("/students").get(isAuthorized, isCompanyVerified, getAllStudents);
router.route("/student/:id").get(isAuthorized, isCompanyVerified, getOneStudent);

export default router;
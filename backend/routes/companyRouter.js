import express from 'express';
import { upload } from '../middlewares/multer.js';
import { registerCompany,loginCompany, logoutCompany, getCompanyProfile, updateCompanyProfile, changePassword, applyForVerification, getAllStudents, getOneStudent, getOneCompany} from '../controllers/companyController.js';
const router = express.Router();
import { isCompanyLoggedIn, isCompanyLoggedInandVerified } from '../middlewares/companyAuth.js';

router.route("/register").post(registerCompany);
router.route("/login").post(loginCompany);
router.route("/:id/detail").get(getOneCompany);
router.route("/logout").get(isCompanyLoggedIn, logoutCompany);
router.route("/details").get(isCompanyLoggedIn, getCompanyProfile);
router.route("/update").put(isCompanyLoggedIn,upload.fields
    ([
        {name: "logo", maxCount: 1}
    ]),updateCompanyProfile
    );
router.route("/changePassword").post(isCompanyLoggedIn, changePassword);
router.route("/apply").post(isCompanyLoggedIn, applyForVerification);
router.route("/students").get(isCompanyLoggedInandVerified, getAllStudents);
router.route("/student/:id").get(isCompanyLoggedInandVerified, getOneStudent);


export default router;
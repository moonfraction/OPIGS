import express from 'express';
import { upload } from '../middlewares/multer.js';
import {isAuthorized} from "../middlewares/auth.js";
import { registerCompany,loginCompany, logoutCompany, getCompanyProfile, updateCompanyProfile, applyForVerification} from '../controllers/companyController.js';
const router = express.Router();

router.route("/register").post(
    upload.fields([
        {name: "logo", maxCount: 1}
    ]),
    registerCompany
);
router.route("/login").post(loginCompany);
router.route("/logout").post(isAuthorized, logoutCompany);
router.route("/:id").get(isAuthorized, getCompanyProfile);
router.route("/update").put(isAuthorized,upload.fields
    ([
        {name: "logo", maxCount: 1}
    ]),updateCompanyProfile
    );
router.route("/apply").post(isAuthorized, applyForVerification);

export default router;
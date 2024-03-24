import express from 'express';
import {upload} from '../middlewares/multer.js';
import { isAuthorized } from '../middlewares/auth.js';
import {registerStudent,loginStudent,logoutStudent,changePassword, getStudentProfile} from "../controllers/studentController.js"

const router = express.Router();

router.route("/register").post(
    upload.fields([
        {name: "profilePhoto", maxCount: 1}
    ]),
    registerStudent
);
router.route("/login").post(loginStudent)
router.route("/logout").post(isAuthorized,logoutStudent)
router.route("/changePassword").post(isAuthorized,changePassword)
router.route("/details").get(isAuthorized,getStudentProfile)

export default router;
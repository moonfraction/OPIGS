import express from 'express';
import { upload } from '../middlewares/multer.js';
import { registerStudent, loginStudent, logoutStudent, changePassword, getStudentProfile, updateStudentProfile } from "../controllers/studentController.js"
import { isStudentLoggedIn } from '../middlewares/studentAuth.js';

const router = express.Router();

router.route("/register").post(
    upload.fields([
        { name: "profilePhoto", maxCount: 1 }
    ]),
    registerStudent
);
router.route("/login").post(loginStudent)
router.route("/logout").post(isStudentLoggedIn, logoutStudent)
router.route("/changePassword").post(isStudentLoggedIn, changePassword)
router.route("/details").get(isStudentLoggedIn, getStudentProfile)
router.route("/update").put(isStudentLoggedIn, upload.fields([
    { name: "profilePhoto", maxCount: 1 }
]), updateStudentProfile)


export default router;
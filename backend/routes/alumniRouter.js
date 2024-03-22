import express from 'express';
import { upload } from '../middlewares/multer.js';
import {isAuthorized} from "../middlewares/auth.js";
import { registerAlumni,loginAlumni, approveRequest, logoutAlumni} from '../controllers/alumniController.js';
const router = express.Router();

router.route("/register").post(
    upload.fields([
        {name: "avatarAlumni", maxCount: 1}
    ]),
    registerAlumni
)
router.route("/login").post(loginAlumni);
router.route("/logout").post(isAuthorized, logoutAlumni);
router.route("/request/:stu_id").get(approveRequest);

export default router;
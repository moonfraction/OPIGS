import express from 'express';
import { upload } from '../middlewares/multer.js';
import {isAuthorized} from "../middlewares/auth.js";
import { registerAlumni,loginAlumni, approveRequest, logoutAlumni} from '../controllers/alumniController.js';
const alumniRouter = express.Router();

alumniRouter.route("/register").post(
    upload.fields([
        {name: "avatarAlumni", maxCount: 1}
    ]),
    registerAlumni
)
alumniRouter.route("/login").post(loginAlumni);
alumniRouter.route("/logout").post(isAuthorized, logoutAlumni);
alumniRouter.route("/request/:stu_id").get(approveRequest);

export default alumniRouter ;
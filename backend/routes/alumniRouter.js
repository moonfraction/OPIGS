import express from 'express';
import { upload } from '../middlewares/multer.js';
import {isAuthorized} from "../middlewares/auth.js";
import { registerAlumni,loginAlumni, approveRequest, logoutAlumni, getAllAlumni, updateAlumniProfile, updateAlumniAvatar} from '../controllers/alumniController.js';
import { isAlumniLoggedIn } from '../middlewares/isAlumniLoggedIn.js';
const alumniRouter = express.Router();

alumniRouter.route("/register").post(
    upload.fields([
        {name: "avatarAlumni", maxCount: 1}
    ]),
    registerAlumni
)
alumniRouter.route("/login").post(loginAlumni);
alumniRouter.route("/logout").post(isAuthorized, logoutAlumni);
alumniRouter.route("/request/:id").get(approveRequest);
alumniRouter.route("/getall").get(getAllAlumni);
alumniRouter.route("/update-info").put(isAlumniLoggedIn, updateAlumniProfile);
alumniRouter.route("/update-avatar").put(isAlumniLoggedIn, 
    upload.fields([
        {name: "avatarAlumni", maxCount: 1}
    ]),    
    updateAlumniAvatar
);

export default alumniRouter ;
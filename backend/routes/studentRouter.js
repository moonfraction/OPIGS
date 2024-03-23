import express from 'express';
import {upload} from '../middlewares/multer.js';
import { isAuthorized } from '../middlewares/auth.js';
import {registerStudent,loginStudent,logoutStudent,changePassword,/*uploadResume*/uploadProfilePhoto,viewAllJobs,viewAppliedJobs,studentNotifications,TalkToAlumni} from "../controllers/studentController.js"

const studentRouter = express.Router();

studentRouter.route("/register").post(
    // upload.fields([
    //     {name:"profilePhoto" ,maxCount:1}
    // ]),
    registerStudent
)

studentRouter.route("/login").post(loginStudent)
studentRouter.route("/logout").post(isAuthorized,logoutStudent)
studentRouter.route("/changePassword/:stu_id").post(isAuthorized,changePassword)
studentRouter.route("/uploadProfilePhoto/:stu_id").post(isAuthorized,uploadProfilePhoto)
studentRouter.route("/viewAllJobs").get(viewAllJobs)
studentRouter.route("/viewAppliedJobs").get(viewAppliedJobs)
studentRouter.route("notification").get(studentNotifications)
studentRouter.route("/ChatWithAlumni").get(TalkToAlumni)

export default studentRouter;
import express from 'express';
import {upload} from '../middlewares/multer.js';
import { isAuthorized } from '../middlewares/auth.js';
import {registerStudent,loginStudent,logoutStudent,changePassword,uploadProfilePhoto,/*viewAllJobs*/studentNotifications,talkToAlumni} from "../controllers/studentController.js"
import { jobSeekerGetAllApplications, postApplication, studentDeleteApplication } from '../controllers/applicationController.js';

const studentRouter = express.Router();

studentRouter.route("/register").post(
    registerStudent
)

studentRouter.route("/login").post(loginStudent)
studentRouter.route("/logout").post(isAuthorized,logoutStudent)
studentRouter.route("/changePassword/:stu_id").post(isAuthorized,changePassword)
studentRouter.route("/uploadProfilePhoto/:id").put(isAuthorized, upload.fields([
    {name :"profilePhoto",maxCount : 1}
]), uploadProfilePhoto);
// studentRouter.route("/viewAllJobs").get(viewAllJobs)
studentRouter.route("/MyApplications").post(isAuthorized,jobSeekerGetAllApplications)
studentRouter.route("/notification").get(studentNotifications)
studentRouter.route("/chatWithAlumni").get(talkToAlumni)
studentRouter.route("/postApplication").post(isAuthorized,postApplication)
studentRouter.route("/deleteApplication").post(studentDeleteApplication)

export default studentRouter;
import express from 'express';
import { upload } from '../middlewares/multer.js';
import { registerAlumni,loginAlumni, approveRequest, logoutAlumni, getAllAlumni, updateAlumniProfile, seeAllRequests, seeOneRequest, deleteRequest, changePassword} from '../controllers/alumniController.js';
import { isAlumniLoggedIn } from '../middlewares/alumniAuth.js';
const router = express.Router();

router.route("/register").post(registerAlumni)
router.route("/login").post(loginAlumni);
router.route("/logout").post(isAlumniLoggedIn, logoutAlumni);
router.route("/request/:id").get(isAlumniLoggedIn, seeOneRequest);
router.route("/request/:id/approve").put(isAlumniLoggedIn, approveRequest);
router.route("/request/:id/delete").delete(isAlumniLoggedIn, deleteRequest);
router.route("/requests").get(isAlumniLoggedIn, seeAllRequests);
router.route("/getall").get(getAllAlumni);
router.route("/update").put(isAlumniLoggedIn, upload.fields([
    {name: "avatar", maxCount: 1}
]), updateAlumniProfile);
router.route("/changePassword").post(isAlumniLoggedIn, changePassword);


export default router ;
import express from 'express';
const router = express.Router();
import { getUserLoggedIn } from '../controllers/loginController.js';

router.route('/').get(getUserLoggedIn);
export default router;
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import alumniRouter from './routes/alumniRouter.js';
import studentRouter from './routes/studentRouter.js';
import companyRouter from './routes/companyRouter.js';
import applicationRouter from './routes/applicationRouter.js';
import jobRouter from './routes/jobRouter.js';
import {dbConnection} from './database/dbConnection.js';
import {errorMiddleware} from './middlewares/error.js';
import adminRouter from './routes/adminRouter.js';
import { upload } from './middlewares/multer.js';
import bodyParser from 'body-parser';
import getUserLoggedInRouter from './routes/getUserLoggedInRouter.js';

const app = express();
dotenv.config({path: "./config/config.env"});
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST","DELETE","PUT"],
    credentials: true,
}));


app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('', getUserLoggedInRouter);
app.use('/api/v1/alumni', alumniRouter);
app.use('/api/v1/student',studentRouter);
app.use('/api/v1/company', companyRouter);
app.use('/api/v1/job', jobRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/application', applicationRouter);

dbConnection();
app.use(errorMiddleware);


export default app;
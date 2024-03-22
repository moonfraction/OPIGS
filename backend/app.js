import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import alumniRouter from './routes/alumniRouter.js';
import {dbConnection} from './database/dbConnection.js';
import {errorMiddleware} from './middlewares/error.js';

const app = express();
dotenv.config({path: "./config/config.env"});

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST","DELETE","PUT"],
    credentials: true,
}));

dbConnection()

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/v1/alumni', alumniRouter);
app.use(errorMiddleware);


export default app;
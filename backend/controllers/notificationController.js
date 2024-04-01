import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import GeneralNotification from "../models/generalNotificationSchema.js";
import ToAllNotif from "../models/toAllNotificationSchema.js";

const getJobPostNotification = catchAsyncError(async (req,res) => {
    const newJobs = await ToAllNotif.find({});
    res.status(200).json({
        success:true,
        newJobs
    })
})

const getGeneralNotif = catchAsyncError(async (req,res) => {
    const generalNotif = await GeneralNotification.find({});
    res.status(200).json({
        success:true,
        generalNotif
    })
})

const generateJobNotification = catchAsyncError(async (req,res) => {
    const {title} = req.body;
    const id = req.user._id;
    const newNotif = await ToAllNotif.create({
        title,
        company: id
    });
    res.status(200).json({
        success:true,
        newNotif
    })
})

export {getJobPostNotification,getGeneralNotif,generateJobNotification}
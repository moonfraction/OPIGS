import Verification from '../models/verificationSchema.js';
import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/error.js'
import Company from '../models/companySchema.js';
import ToAllNotif from '../models/toAllNotificationSchema.js';
import Job from '../models/jobSchema.js';
import GeneralNotification from '../models/generalNotificationSchema.js';
import { sendToken } from '../utils/jwtToken.js';
import Admin from '../models/adminSchema.js';

const registerAdmin = catchAsyncError(async (req,res,next) => {
    const {email, password} = req.body;
    const newAdmin = await Admin.create({
        email,
        password
    })
    const accessToken = newAdmin.generateAccessToken();
    res.status(201).json({
        success:true,
        accessToken
    })
});

const loginAdmin = catchAsyncError(async (req,res,next) => {
    const {email, password} = req.body;
    if(!email || !password){
        throw new ErrorHandler("Please provide email and password", 400);
    }
    const admin = await Admin.findOne({email});
    if(!admin){
        throw new ErrorHandler("Invalid credentials", 401);
    }
    const isPasswordMatched = await admin.comparePassword(password);
    if(!isPasswordMatched){
        throw new ErrorHandler("Invalid credentials", 401);
    }
    sendToken(admin, 200, res, "Token for admin generated successfully");
    res.status(200).json({
        success:true,
        admin
    })
});

const logoutAdmin = catchAsyncError(async (req,res,next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({
        success:true,
        message:"Logged out successfully"
    })
})

// the id passed is that of the verification schema object
const verifyCompany = catchAsyncError(async (req,res,next) => {
    const {req_id} = req.params;
    const req_obj = await Verification.findById(req_id);
    if(!req_obj){
        throw new ErrorHandler("Request not found", 404);
    }
    const company_to_verify = Company.findById(req_obj.company);
    if(!company_to_verify){
        throw new ErrorHandler("Company not found", 404);
    }
    company_to_verify.status = "Approved";
    await company_to_verify.save();
    req_obj.deleteOne();
})

const deleteCompanyRequest = catchAsyncError(async (req,res,next) => {
    const {req_id} = req.params;
    const req_obj = await Verification.findById(req_id);
    req_obj.deleteOne();
})

const updatePassword = catchAsyncError(async (req,res,next) => {
    const {password} = req.body;
    const admin = req.user;
    admin.password = password;
    await admin.save({validateBeforeSave:false});
})

//The job id is passed in the url params and all are updated about the job
const sendNotificationOnJobUpdate = catchAsyncError(async (req,res,next) => {
    const {id} = req.params;
    const job = await Job.findById(id);
    const title = job.title;
    const companyId = await Company.findById(job.company);
    const company = companyId.name;
    const newJobUpdateNotif = await ToAllNotif.create({
        title,
        company,
        postedOn: job.createdAt
    })
    res.status(200).json({
        success:true,
        newJobUpdateNotif
    })
})

const sendGeneralNotification = catchAsyncError(async (req,res,next) => {
    const {title, description} = req.body;
    const newNotif = await GeneralNotification.create({
        title,
        description
    })
    res.status(200).json({
        success:true,
        newNotif
    })
});

export {verifyCompany, updatePassword,deleteCompanyRequest,sendNotificationOnJobUpdate,sendGeneralNotification,registerAdmin,loginAdmin,logoutAdmin};
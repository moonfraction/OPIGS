import Verification from '../models/verificationSchema.js';
import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/error.js'
import Company from '../models/companySchema.js';
import ToAllNotif from '../models/toAllNotificationSchema.js';
import Job from '../models/jobSchema.js';
import GeneralNotification from '../models/generalNotificationSchema.js';
import { sendToken } from '../utils/jwtToken.js';
import Admin from '../models/adminSchema.js';

//register admin => /api/v1/admin/register
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

//login admin => /api/v1/admin/login
const loginAdmin = catchAsyncError(async (req,res,next) => {
    const {email, password} = req.body;
    console.log(password);
    if(!email || !password){
        throw new ErrorHandler("Please provide email and password", 400);
    }
    const admin = await Admin.find({email});
    console.log(admin);
    if(admin.length < 1){
        throw new ErrorHandler("Invalid credentials", 401);
    }
    var adminOne = admin[0];
    console.log(adminOne)
    const isPasswordMatched = await adminOne.comparePassword(password);
    console.group(isPasswordMatched);
    if(!isPasswordMatched){
        throw new ErrorHandler("Invalid credentials 2", 401);
    }
    sendToken(adminOne, 200, res, "Admin logged in successfully");
});

//logout admin => /api/v1/admin/logout
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

//admin see all the requests and verify them => /api/v1/admin/all-requests
const viewAllCompanyRequests = catchAsyncError(async (req,res,next) => {
    const allRequests = await Verification.find({status: "Pending"});
    res.status(200).json({
        success:true,
        allRequests
    })
});

// the id passed is that of the verification schema object
// the company is verified and the request is deleted
// the company status is updated to approved or rejected
// verify company => /api/v1/admin/verify/:req_id
const verifyCompany = catchAsyncError(async (req,res,next) => {
    //change company.status to approved or rejected
    const {stats} = req.body;
    const {req_id} = req.params;
    const req_obj = await Verification.findById(req_id);
    if(!req_obj){
        throw new ErrorHandler("Request not found", 404);
    }
    const updatedCompany = await Company.findByIdAndUpdate(req_obj.company, {status: stats});
    await req_obj.deleteOne();
    const company = await Company.findById(req_obj.company);
    if(stats==="Approved"){res.status(200).json({
        success:true,
        message:"Company Approved",
        company
        
    })}
    else {res.status(200).json({
        success:true,
        message:"Company Rejected",
        company
    })}

})

//delete company request => /api/v1/admin/delete/:req_id
const deleteCompanyRequest = catchAsyncError(async (req,res,next) => {
    const {req_id} = req.params;
    const req_obj = await Verification.findById(req_id);
    await req_obj.deleteOne();
    res.status(200).json({
        success:true,
        message:"Request deleted successfully"
    })
})

//update password => /api/v1/admin/update-password
const updatePassword = catchAsyncError(async (req,res,next) => {
    const adminId = req.user._id || req.user.id;
    const admin = await Admin.findById(adminId);
    if (!admin) {
        return next(new ErrorHandler('Admin not found', 404));
    }
    const { oldPassword, newPassword } = req.body;
    if(!oldPassword || !newPassword){
        return next(new ErrorHandler("Please enter old and new password", 400));
    }
    if(oldPassword === newPassword){
        return next(new ErrorHandler("Old password and new password cannot be same", 400));
    }
    const passwordMatch = await admin.comparePassword(oldPassword);
    if (!passwordMatch) {
        return next(new ErrorHandler('Enter correct old password', 400));
    }
    admin.password = newPassword;
    await admin.save();
    sendToken(admin, 200, res, "Password changed successfully");
})

//The job id is passed in the url params and all are updates about the job are sent to all the users
//send notification on job update => /api/v1/admin/job-notif/:job_id
const sendNotificationOnJobUpdate = catchAsyncError(async (req,res,next) => {
    const {job_id} = req.params;
    const job = await Job.findById(job_id);
    if(!job){
        throw new ErrorHandler("Job not found", 404);
    }
    const title = job.title;
    const company = await Company.findById(job.company);
    if(!company){
        throw new ErrorHandler("Company not found", 404);
    }

    const newJobUpdateNotif = await ToAllNotif.create({
        title,
        company: job.company,
        postedOn: job.createdAt
    })
    res.status(200).json({
        success:true,
        newJobUpdateNotif
    })
})

const sendGeneralNotification = catchAsyncError(async (req,res,next) => {
    const {title, description} = req.body;
    if(!title || !description){
        return next(new ErrorHandler("Please enter all fields",400)) ;
    }
    const newNotif = await GeneralNotification.create({
        title,
        description
    })
    res.status(200).json({
        success:true,
        message:"Notification sent successfully",
        newNotif
    })
});

export {verifyCompany, updatePassword,deleteCompanyRequest,sendNotificationOnJobUpdate,sendGeneralNotification,registerAdmin,loginAdmin,logoutAdmin, viewAllCompanyRequests};
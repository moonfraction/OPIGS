import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Application from "../models/applicationSchema.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Job from "../models/jobSchema.js";
import Student from "../models/studentSchema.js";
import Company from "../models/companySchema.js";

// get all applications for a company => /api/v1/applications/company
export const companyGetAllApplications = catchAsyncError(async (req, res, next) => {
    const companyID =req.user._id || req.user.id;
    if (!companyID) {
        return next(new ErrorHandler("Company not found", 404));
    }
    const company = await Company.findById(companyID);
    if (!company) {
        return next(new ErrorHandler("Company not found", 404));
    }
    // this will be company id
    //search all applications and for each application find the jobId, then check if the jobId belongs to the company
    const applications = await Application.find({});
    let companyApplications = [];
    for (let i = 0; i < applications.length; i++) {
        const application = applications[i];
        const job = await Job.findById(application.jobId);
        if (job.company.toString() === companyID) {
            companyApplications.push(application);
        }
    }
    res.status(200).json({
        success: true,
        companyApplications
    });
});

// company get single application => /api/v1/application/company/:id
export const companyGetSingleApplication = catchAsyncError(async (req, res, next) => {
    const application = await Application.findById(req.params.id);
    if (!application) {
        return next(new ErrorHandler("Application not found", 404));
    }
    const job = await Job.findById(application.jobId);
    if (!job) {
        return next(new ErrorHandler("Job not found", 404));
    }
    const companyID = req.user._id || req.user.id;
    if (job.company.toString() !== companyID) {
        return next(new ErrorHandler("User not authorized to view this application", 401));
    }
    res.status(200).json({
        success: true,
        application
    });
});

//company change application status => /api/v1/application/company/:id/status
export const companyChangeApplicationStatus = catchAsyncError(async (req, res, next) => {
    const application = await Application.findById(req.params.id);
    if (!application) {
        return next(new ErrorHandler("Application not found", 404));
    }
    const job = await Job.findById(application.jobId);
    if (!job) {
        return next(new ErrorHandler("Job not found", 404));
    }
    const companyID = req.user._id || req.user.id;
    if (job.company.toString() !== companyID) {
        return next(new ErrorHandler("User not authorized to change status of this application", 401));
    }
    const { status } = req.body;
    if (!status) {
        return next(new ErrorHandler("Please enter the status", 400));
    }
    application.status = status;
    await application.save();
    res.status(200).json({
        success: true,
        message: "Application status updated successfully",
        application
    });
});

// get all applications for a job => /api/v1/applications/student
export const studentGetAllApplications = catchAsyncError(async (req, res, next) => {
    const applicantId = req.user._id || req.user.id;
    if (!applicantId) {
        return next(new ErrorHandler("Login to view applications", 401));
    }
    const student = await Student.findById(applicantId);
    if (!student) {
        return next(new ErrorHandler("Only students can view applications", 400));
    }

    const applications = await Application.find({ applicantId });
    res.status(200).json({
        success: true,
        applications
    });
});

// get single application => /api/v1/application/delete/:id
export const studentDeleteApplication = catchAsyncError(async (req, res, next) => {
    const application = await Application.findById(req.params.id);
    if (!application) {
        return next(new ErrorHandler("Application not found", 404));
    }
    const studentId = req.user._id || req.user.id;
    if (application.applicantId.toString() !== studentId) {
        return next(new ErrorHandler("You are not authorized to delete this application", 401));
    }
    await application.deleteOne();
    res.status(200).json({
        success: true,
        message: "Application deleted successfully"
    });
});

// post application => /api/v1/application/post
export const postApplication = catchAsyncError(async(req,res,next)=>{
    const { name, email, coverLetter, phone, address, jobId } = req.body;
    
    const applicantId = req.user._id || req.user.id;
    if (!applicantId) {
        return next(new ErrorHandler("Student not found", 404));
    }
    const student = await Student.findById(applicantId);
    if (!student) {
        return next(new ErrorHandler("Only students can apply for jobs", 400));
    }

    if (!jobId) {
        return next(new ErrorHandler("Please enter the job id", 400));
    }
    const jobDetails = await Job.findById(jobId);
    if (!jobDetails) {
        return next(new ErrorHandler("Job not found", 404));
    }

    const companyId = jobDetails.company
    if (!companyId) {
        return next(new ErrorHandler("Company not found", 404));
    }
    if (companyId.toString() === applicantId) {
        return next(new ErrorHandler("You cannot apply to your own job", 400));
    }

    if (!name || !email || !coverLetter || !phone || !address) {
        return next(new ErrorHandler("Please enter all the fields", 400));
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Upload your resume", 400));
    }

    //upload resume to cloudinary as an image
    let resumeLocalPath;
    if (req.files && Array.isArray(req.files.resume) && req.files.resume.length > 0) {
        resumeLocalPath = req.files.resume[0].path;
    }
    if (!resumeLocalPath) {
        return next(new ErrorHandler("Please upload your resume", 400));
    }
    const resume = await uploadOnCloudinary(resumeLocalPath);
    if (!resume) {
        return next(new ErrorHandler("Error while uploading resume", 500));
    }

    const application = await Application.create({
        name,
        email,
        coverLetter,
        phone,
        address,
        applicantId,
        jobId,
        resume: resume.url
    });

    res.status(201).json({
        success: true,
        message: "Application submitted successfully!",
        application
    });
});

//get approved applications => /api/v1/applications/approved
export const getApprovedApplications = catchAsyncError(async(req,res,next)=>{
    //check if the user is student
    const studentId = req.user._id || req.user.id;
    if (!studentId) {
        return next(new ErrorHandler("Student not found", 404));
    }
    const student = await Student.findById(studentId);
    if (!student) {
        return next(new ErrorHandler("Only students can view approved applications", 400));
    }
    
    const applications = await Application.find({status: 'Approved'});
    res.status(200).json({
        success: true,
        applications
    });
});
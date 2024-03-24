import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Application from "../models/applicationSchema.js";
import cloudinary from "cloudinary";
import Job from "../models/jobSchema.js";

export const companyGetAllApplications = catchAsyncError(async (req, res, next) => {
    const { c_id } = req.params;
    const applications = await Application.find({ "companyId": c_id });
    res.status(200).json({
        success: true,
        applications
    });
});

export const jobSeekerGetAllApplications = catchAsyncError(async (req, res, next) => {
    const { stu_id } = req.params;
    const applications = await Application.find({ "applicantId": stu_id });
    res.status(200).json({
        success: true,
        applications
    });
});

export const studentDeleteApplication = catchAsyncError(async (req, res, next) => {
    const { a_id } = req.params;
    const application = await Application.findById(a_id);
    if (!application) {
        return next(new ErrorHandler("Application not found", 404));
    }
    if (application.applicantId.toString() !== req.user.id) {
        return next(new ErrorHandler("User not authorized to delete this application", 401));
    }
    await application.deleteOne();
    res.status(200).json({
        success: true,
        message: "Application deleted successfully!"
    });
});

export const postApplication = catchAsyncError(async(req,res,next)=>{
    const { name, email, coverLetter, phone, address, jobId } = req.body;
    const {applicantId} = req.params;


    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Upload your resume", 400));
    }
    const { resume } = req.files;

    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(resume.mimetype)) {
        return next(
            new ErrorHandler("Invalid file type. Please upload a file of type png, jpeg or webp", 400)
        );
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
        resume.tempFilePath
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
            "Cloudinary Error:",
            cloudinaryResponse.error || "Unknown Cloudinary error"
        );
        return next(new ErrorHandler("Failed to upload Resume to Cloudinary", 500));
    }

   
    if (!jobId) {
        return next(new ErrorHandler("Please enter the job id", 400));
    }
    const jobDetails = await Job.findById(jobId);
    if (!jobDetails) {
        return next(new ErrorHandler("Job not found", 404));
    }
    const companyId = jobDetails.company
    if (!name || !email || !coverLetter || !phone || !address || !jobId|| !applicantId ||!companyId|| !resume) {
        return next(new ErrorHandler("Please enter all the fields", 400));
    }

    const application = await Application.create({
        name,
        email,
        coverLetter,
        phone,
        address,
        resume:cloudinaryResponse.url,
        applicantId,
        jobId
    });

    res.status(201).json({
        success: true,
        message: "Application submitted successfully!",
        application
    });
});

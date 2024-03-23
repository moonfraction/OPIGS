import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Application from "../models/applicationSchema.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {sendToken} from "../utils/jwtToken.js";

export const jobSeekerDeleteApplication = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role !== "Job Seeker") {
        return next(new ErrorHandler("User not authorized to delete the application", 401));
    }
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
        return next(new ErrorHandler("Application not found", 401));
    }
    if (application.applicantId.user.toString() !== req.user.id) {
        return next(new ErrorHandler("User not authorized to delete this application", 401));
    }
    await application.deleteOne();
    res.status(200).json({
        success: true,
        message: "Application deleted successfully!"
    });
});

export const postApplication = catchAsyncError(async(req,res,next)=>{
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

    const { name, email, coverLetter, phone, address, jobId } = req.body;

    const applicantId = req.user.id;
    
    if (!jobId) {
        return next(new ErrorHandler("Please enter the job id", 400));
    }

    const jobDetails = await Job.findById(jobId);
    if (!jobDetails) {
        return next(new ErrorHandler("Job not found", 404));
    }

    const employerId = jobDetails.jobPostedBy;

    if (!name || !email || !coverLetter || !phone || !address || !applicantId || !employerId || !resume) {
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
        employerId
    });

    res.status(201).json({
        success: true,
        message: "Application submitted successfully!",
        application
    });
});

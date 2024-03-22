import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Application from "../models/applicationSchema.js";
import cloudinary from "cloudinary";
import Job from "../models/jobSchema.js";

export const employerGetAllApplications = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role !== "Employer") {
        return next(new ErrorHandler("User not authorized to access the applications", 401));
    }

    const { id } = req.user;
    const applications = await Application.find({ "employerId.user": id });
    res.status(200).json({
        success: true,
        applications
    });
});

export const jobSeekerGetAllApplications = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role !== "Job Seeker") {
        return next(new ErrorHandler("User not authorized to access the applications", 401));
    }

    const { id } = req.user;
    const applications = await Application.find({ "applicantId.user": id });
    res.status(200).json({
        success: true,
        applications
    });
});

export const jobSeekerDeleteApplication = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role !== "Job Seeker") {
        return next(new ErrorHandler("User not authorized to delete the application", 401));
    }
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
        return next(new ErrorHandler("Application not found", 404));
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

export const postApplication = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role !== "Job Seeker") {
        return next(new ErrorHandler("User not authorized to post the application", 401));
    }
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Upload your resume!!!", 400));
    }
    const { resume } = req.files; //png format in tut, cloudinay accepts pdf, but cannot allow to get the file
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(resume.mimetype)) {
        return next(
            new ErrorHandler("Invalid file type. Please upload a file of type png, jpeg or webp", 400)
        );
    }
    // if(resume.size > process.env.MAX_FILE_UPLOAD) {
    //     return next(new ErrorHandler("File size exceeds the limit", 400));
    // }

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
    const applicantId = {
        user: req.user.id,
        role: req.user.role
    };
    if (!jobId) {
        return next(new ErrorHandler("Please enter the job id", 400));
    }

    const jobDetails = await Job.findById(jobId);
    if (!jobDetails) {
        return next(new ErrorHandler("Job not found", 404));
    }

    const employerId = {
        user: jobDetails.jobPostedBy,
        role: "Employer"
    };
    if (applicantId.user.toString() === employerId.user.toString()) {
        return next(new ErrorHandler("You cannot apply to your own job", 400));
    }

    if (!name || !email || !coverLetter || !phone || !address || !applicantId || !employerId || !resume) {
        return next(new ErrorHandler("Please enter all the fields", 400));
    }

    const application = await Application.create({
        name,
        email,
        coverLetter,
        phone,
        address,
        resume: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        },
        applicantId,
        employerId
    });

    res.status(201).json({
        success: true,
        message: "Application submitted successfully!",
        application
    });
});
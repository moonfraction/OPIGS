import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Job from "../models/jobSchema.js";
import Company from "../models/companySchema.js";

// Get all jobs => /api/v1/job/alljobs
export const getAllJobs = catchAsyncError(async (req, res, next) => {
    const jobs = await Job.find({ expired: false });
    res.status(200).json({
        success: true,
        jobs
    });
});

// Get all jobs => /api/v1/myjobs
export const getMyJobs = catchAsyncError(async (req, res, next) => {
    const { id } = req.user;
    const myJobs = await Job.find({ company: id });
    res.status(200).json({
        success: true,
        myJobs
    });
});

// update job => /api/v1/job/update/:id
export const updateJob = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    let job = await Job.findById(id);
    if (!job) {
        return next(new ErrorHandler("Job not found", 404));
    }
    const company = req.user.id || req.user._id;
    if (job.company.toString() !== company) {
        return next(new ErrorHandler("You are not authorized to update this job", 401));
    }
    const updatedJob = await Job.findByIdAndUpdate
        (id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });
    res.status(200).json({
        success: true,
        message: "Job updated successfully",
        updatedJob
    });
});

// delete job => /api/v1/job/delete/:id
export const deleteJob = catchAsyncError(async (req, res, next) => {
    let job = await Job.findById(req.params.id);
    if (!job) {
        return next(new ErrorHandler("Job not found", 404));
    }
    const company = req.user.id || req.user._id;
    if (job.company.toString() !== req.user.id) {
        return next(new ErrorHandler("User not authorized to delete this job", 401));
    }
    await job.deleteOne();
    res.status(200).json({
        success: true,
        message: "Job deleted successfully"
    });
});

// get job details => /api/v1/job/:id
export const getJobDetails = catchAsyncError(async (req, res, next) => {
    const job = await Job.findById(req.params.id);
    if (!job) {
        return next(new ErrorHandler("Job not found", 404));
    }
    res.status(200).json({
        success: true,
        job
    });
});

// post job => /api/v1/job/post
export const postJob = catchAsyncError(async (req, res, next) => {
    const { category, title, description, location, salary, jobType,postedOn,deadline, expired} = req.body;

    if (
        !category ||
        !title ||
        !description ||
        !location ||
        !jobType ||
        !deadline ||
        !salary
    ) {
        return next(new ErrorHandler("Please fill all fields", 400));
    }

    // Fetch all jobs posted by the same company
    const companyId = req.user.id || req.user._id;
    const companyJobs = await Job.find({ company: companyId });

    // Check each job posted by the company
    for (let job of companyJobs) {
        if (job.expired === true) {
            continue;
        }
        if(job.deadline < new Date()){
            job.expired = true;
            await job.save();
            continue;
        }
        //compare deadline of job with deadline of new jo


        // If all fields are identical to the new job, return an error
        if (
            job.category === category &&
            job.title === title &&
            job.description === description &&
            job.location === location &&
            job.salary === salary &&
            job.jobType === jobType
            ) {
            return next(new ErrorHandler("Cannot post identical job", 400));
        }
    }

    const company = await Company.findById(companyId);
    console.log(company);
    const job = await Job.create({
        category,
        title,
        description,
        location,
        salary,
        company: companyId,
        companyName : company.name,
        jobType,
        postedOn,
        deadline,
        expired,
    });

    res.status(200).json({
        success: true,
        message: "Job posted successfully",
        job
    });
});

export const getJobsByCompanyId =  catchAsyncError(async (req,res) => {
    const company_id = req.user._id;
    const jobs = await Job.find({company: company_id});
    if(!jobs){
        return next(new ErrorHandler("No jobs found", 404));
    }
    res.status(200).json({
        success: true,
        jobs
    });
})


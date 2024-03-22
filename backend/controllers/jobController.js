import {catchAsyncError} from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Job from "../models/jobSchema.js";

export const getAllJobs = catchAsyncError(async (req, res, next) => {
    const jobs = await Job.find({expired: false});
    res.status(200).json({
        success: true,
        jobs
    });
});

export const postJob = catchAsyncError(async (req, res, next) => {
    const {role} = req.user;
    if(role !== "Employer") {
        return next(new ErrorHandler("User not authorized to post a job", 401));
    }
    const {title, description, category, country, location, fixedSalary, salaryFrom, salaryTo, expired, jobPostedOn, jobPostedBy, company} = req.body;

    if(!title || !description || !category || !country || !location || !company){
        return next(new ErrorHandler("Please enter all the fields", 400));
    }
    if(!fixedSalary && (!salaryFrom || !salaryTo)) {
        return next(new ErrorHandler("Please enter fixed salary or salary range", 400));
    }

    if(fixedSalary && (salaryFrom || salaryTo)) {
        return next(new ErrorHandler("Cannot enter both fixed salary and salary range together", 400));
    }

    const postedBy = req.user.id;
    const job = await Job.create({
        title,
        description,
        category,
        country,
        location,
        fixedSalary,
        salaryFrom,
        salaryTo,
        expired,
        jobPostedOn,
        jobPostedBy: postedBy,
        company
    });
    
    res.status(201).json({
        success: true,
        message: "Job posted successfully",
        job
    });
});

export const getMyJobs = catchAsyncError(async (req, res, next) => {
    const {role} = req.user;
    if(role !== "Employer") {
        return next(new ErrorHandler("User not authorized to access this resource", 401));
    }
    const {id} = req.user;
    const myJobs = await Job.find({jobPostedBy: id});
    res.status(200).json({
        success: true,
        myJobs
    });
});

export const updateJob = catchAsyncError(async (req, res, next) => {
    const {role} = req.user;
    if(role !== "Employer") {
        return next(new ErrorHandler("User not authorized to update a job", 401));
    }
    const {id} = req.params;
    let job = await Job.findById(id);
    if(!job) {
        return next(new ErrorHandler("Job not found", 404));
    }
    if(job.jobPostedBy.toString() !== req.user.id) {
        return next(new ErrorHandler("User not authorized to update this job", 401));
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

export const deleteJob = catchAsyncError(async (req, res, next) => {
    const {role} = req.user;
    if(role !== "Employer") {
        return next(new ErrorHandler("User not authorized to delete a job", 401));
    }
    const {id} = req.params;
    let job = await Job.findById(id);
    if(!job) {
        return next(new ErrorHandler("Job not found", 404));
    }
    if(job.jobPostedBy.toString() !== req.user.id) {
        return next(new ErrorHandler("User not authorized to delete this job", 401));
    }
    await job.deleteOne();
    res.status(200).json({
        success: true,
        message: "Job deleted successfully"
    });
});
   
export const getJobDetails = catchAsyncError(async (req, res, next) => {
    const job = await Job.findById(req.params.id);
    if(!job) {
        return next(new ErrorHandler("Job not found", 404));
    }
    res.status(200).json({
        success: true,
        job
    });
});
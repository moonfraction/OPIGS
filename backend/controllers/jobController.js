import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Job from "../models/jobSchema.js";

//check if company is verfied 
//if not verified, return error
//if verified, proceed with the request
const checkCompanyVerification = (req, res, next) => {
    if (req.user.status !== 'Approved' || req.user.isverified !== 'Verified'){
        return next(new ErrorHandler("Company is not verified", 400));
    }
    next();
}

export const getAllJobs = catchAsyncError(async (req, res, next) => {
    checkCompanyVerification(req, res, next);

    const jobs = await Job.find({ expired: false });
    res.status(200).json({
        success: true,
        jobs
    });
});

export const getMyJobs = catchAsyncError(async (req, res, next) => {
    checkCompanyVerification(req, res, next);

    const { id } = req.user;
    const myJobs = await Job.find({ company: id });
    res.status(200).json({
        success: true,
        myJobs
    });
});


export const updateJob = catchAsyncError(async (req, res, next) => {
    checkCompanyVerification(req, res, next);

    const { id } = req.params;
    let job = await Job.findById(id);
    if (!job) {
        return next(new ErrorHandler("Job not found", 404));
    }
    if (job.company.toString() !== req.user.id) {
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

export const deleteJob = catchAsyncError(async (req, res, next) => {
    checkCompanyVerification(req, res, next);

    let job = await Job.findById(req.params.id);
    if (!job) {
        return next(new ErrorHandler("Job not found", 404));
    }
    if (job.company.toString() !== req.user.id) {
        return next(new ErrorHandler("User not authorized to delete this job", 401));
    }
    await job.deleteOne();
    res.status(200).json({
        success: true,
        message: "Job deleted successfully"
    });
});

export const getJobDetails = catchAsyncError(async (req, res, next) => {
    checkCompanyVerification(req, res, next);

    const job = await Job.findById(req.params.id);
    if (!job) {
        return next(new ErrorHandler("Job not found", 404));
    }
    res.status(200).json({
        success: true,
        job
    });
});


export const postJob = catchAsyncError(async (req, res, next) => {
    checkCompanyVerification(req, res, next);

    const { category, title, description, location, fixedSalary, salaryFrom, salaryTo, jobType, postedOn, deadline, expired} = req.body;

    // Fetch all jobs posted by the same company
    const companyJobs = await Job.find({ company: req.user.id });

    if (
        !category ||
        !title ||
        !description ||
        !location ||
        !jobType ||
        !deadline
    ) {
        return next(new ErrorHandler("Please fill all fields", 400));
    }

    if (!fixedSalary && (!salaryFrom || !salaryTo)) {
        return next(new ErrorHandler("Please enter fixed salary or salary range", 400));
    }

    if (fixedSalary && (salaryFrom || salaryTo)) {
        return next(new ErrorHandler("Cannot enter both fixed salary and salary range together", 400));
    }

    if (salaryFrom && salaryTo) {
        if (salaryFrom >= salaryTo) {
            return next(new ErrorHandler("Salary from must be less than salary to", 400));
        }
        // Check each job posted by the company
        for (let job of companyJobs) {
            // If all fields are identical to the new job, return an error
            if (job.category === category &&
                job.title === title &&
                job.description === description &&
                job.location === location &&
                job.salaryFrom === salaryFrom &&
                job.salaryTo === salaryTo &&
                job.jobType === jobType &&
                job.deadline === deadline &&
                job.expired === expired) {
                return next(new ErrorHandler("Cannot post identical job", 400));
            }
        }
    }

    if (fixedSalary) {
        if (fixedSalary < 0) {
            return next(new ErrorHandler("Fixed salary cannot be negative", 400));
        }
        // Check each job posted by the company
        for (let job of companyJobs) {
            // If all fields are identical to the new job, return an error
            if (job.category === category &&
                job.title === title &&
                job.description === description &&
                job.location === location &&
                job.fixedSalary === fixedSalary &&
                job.jobType === jobType) {
                return next(new ErrorHandler("Cannot post identical job", 400));
            }
        }
    }

    const company = req.user.id;

    const job = await Job.create({
        category,
        title,
        description,
        location,
        fixedSalary,
        salaryFrom,
        salaryTo,
        company,
        jobType,
        postedOn,
        deadline,
        expired
    });

    res.status(200).json({
        success: true,
        message: "Job posted successfully",
        job
    });
});


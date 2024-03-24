import ErrorHandler from "./error.js";
import Company from "../models/companySchema.js";
import { catchAsyncError } from "./catchAsyncError.js";

export const isCompanyVerified = catchAsyncError(async (req, res, next) => {
    const companyId = req.user._id || req.user.id;
    if (!companyId) {
        return next(new ErrorHandler("Company not found", 404));
    }
    const company = await Company.findById(companyId);
    if (!company) {
        return next(new ErrorHandler("Company not found", 404));
    }
    if (company.status !== 'Approved') {
        return next(new ErrorHandler("Company is not approved yet", 401));
    }
    next();
});
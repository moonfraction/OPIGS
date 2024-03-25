import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import Company from "../models/companySchema.js";

export const isCompanyLoggedInandVerified = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("Login first to access this route", 401));
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    if (!req.user) {
        return next(new ErrorHandler("User not authorized to access this route", 401));
    }

    const companyId = req.user.id || req.user._id;
    if (!companyId) {
        return next(new ErrorHandler("Company not found", 404));
    }
    const company = await Company.findById(companyId);
    if (!company) {
        return next(new ErrorHandler("User not authorized to access this route", 401));
    }
    if (company.status !== 'Approved') {
        return next(new ErrorHandler("Company is not approved yet", 401));
    }
    next();
});

export const isCompanyLoggedIn = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("Login first to access this route", 401));
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    if (!req.user) {
        return next(new ErrorHandler("User not authorized to access this route", 401));
    }

    const companyId = req.user.id || req.user._id;
    if (!companyId) {
        return next(new ErrorHandler("Company not found", 404));
    }
    const company = await Company.findById(companyId);
    if (!company) {
        return next(new ErrorHandler("User not authorized to access this route", 401));
    }
    next();
});
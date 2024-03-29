import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import Admin from "../models/adminSchema.js";

export const isAdminLoggedIn = catchAsyncError(async (req, res, next) => {
    const {token} = req.cookies;
    if(!token) {
        return next(new ErrorHandler("User not authorized to access this route", 401));
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const admin = await Admin.findById(decoded._id);
    if(!admin){
        return next(new ErrorHandler("User not authorized to access this route", 401));
    }
    
    req.user = admin;
    next();
});
import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import Student from "../models/studentSchema.js";

const isStudentLoggedIn = catchAsyncError(async (req, res, next) => {
    const token = req.cookies.token;
    console.log(token);
    if (!token) {
        return next(new ErrorHandler("User not authorized to access this route", 401));
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    
    const studentId = req.user._id;
    const student = await Student.findById(studentId);
    if (!student) {
        return next(new ErrorHandler("User not authorized to access this route", 401));
    }
    next();
});

export {isStudentLoggedIn}
import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import Alumni from "../models/alumniSchema.js";

const isAlumniLoggedIn = catchAsyncError(async (req, res, next) => {
    const {token} = req.cookies;
    if(!token) {
        return next(new ErrorHandler("User not authorized to access this route, Login first", 401));
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const alumni = await Alumni.findById(decoded._id);
    if(!alumni){
        return next(new ErrorHandler("User not authorized to access this route", 401));
    }
    req.user = alumni;
    next();
});

export {isAlumniLoggedIn};


import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import Student from "../models/studentSchema.js";
import Company from "../models/companySchema.js";
import jwt from "jsonwebtoken";
import Alumni from "../models/alumniSchema.js";
import Admin from "../models/adminSchema.js";
import ErrorHandler from "../middlewares/error.js";

const getUserLoggedIn = catchAsyncError(async (req,res) => {
    // console.log(req);
    const token = req.cookies.token;
    if(!token){
        return res.status(400).json({
            success:false,
            user:null,
            role:null
        })
    }
    const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    const user = decoded._id;
    const userRole = decoded.role;
    if(userRole === "student"){
        const student = await Student.findById(user);
        if(!student){
            throw new ErrorHandler("User not found",404);
        }
        return res.status(200).json({
            success:true,
            user:student,
            role:userRole
        })
    }
    if(userRole === "company"){
        const company = await Company.findById(user);
        if(!company){
            throw new ErrorHandler("Company not found",404);
        }
        return res.status(200).json({
            success:true,
            user:company,
            role:userRole
        })
    }
    if(userRole === "alumni"){
        const alumni = await Alumni.findById(user);
        if(!alumni){
            throw new ErrorHandler("Alumni not found",404);
        }
        return res.status(200).json({
            success:true,
            user:alumni,
            role:userRole
        })
    }
    if(userRole === "admin"){
        const admin = await Admin.findById(user);
        if(!admin){
            throw new ErrorHandler("Admin not found",404);
        }
        return res.status(200).json({
            success:true,
            user:admin,
            role:userRole
        })
    }
})

export {getUserLoggedIn}
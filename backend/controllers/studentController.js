import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Student from "../models/studentSchema.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {sendToken} from "../utils/jwtToken.js";

//register student => /api/v1/student/register
export const registerStudent = catchAsyncError( async (req, res) => {
    
    const {name,email,password,phone,branch,courseName,yearOfStudy,CGPA,address} = req.body
    if(!name || !email || !phone || !courseName || !branch|| !password || !yearOfStudy ||!CGPA ||!address) {
        throw new ErrorHandler("Please enter all the fields", 400);
    }

    const isEmail = await Student.findOne({email});
    if (isEmail) {
        throw new ErrorHandler("Student already exists with this email", 400);
    }

    //cgpa validation
    if (CGPA < 0 || CGPA > 10) {
        throw new ErrorHandler("CGPA must be between 0 and 10", 400);
    }
    // console.log(req.file);
    let profilePhotoURLLocalPath;
    if(req.file){
        // console.log(req.file);
        profilePhotoURLLocalPath = req.file;
    }
    if (!profilePhotoURLLocalPath) {
        throw new ErrorHandler("Please upload your profile photo",401)
    }

    const profilePhoto = await uploadOnCloudinary(profilePhotoURLLocalPath);
    if (!profilePhoto) {
        throw new ErrorHandler("Error while uploading profile photo",500);
    }

    const student = await Student.create({
        name,
        email,
        password,
        phone,
        branch,
        courseName,
        yearOfStudy,
        CGPA,
        address,
        profilePhoto: profilePhoto.url
    })
    return res.status(201).json({
        success: true,
        message : "Student registered successfully",
        student
    })

} )

//login student => /api/v1/student/login
export const loginStudent = catchAsyncError(async (req, res) =>{
    const {email, password} = req.body
    if (!email || !password) {
        throw new ErrorHandler("Please enter email and password",400)
    }
    

    const student = await Student.findOne({email})
    if (!student) {
        throw new ErrorHandler("Invalid email or password",401)
    }

   const isPasswordValid = await student.comparePassword(password)

   if (!isPasswordValid) {
    throw new ErrorHandler("Invalid email or password",401)
    }
    sendToken(student, 200, res, "Student logged in successfully!")
    
})

//logout student => /api/v1/student/logout
export const logoutStudent = catchAsyncError(async(req, res) => {
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    });
    res.status(200).json({
        success:true,
        message:"Logout successful"
    });
})

//forgot password => /api/v1/student/password/changePassword
export const changePassword = catchAsyncError(async(req, res) => {
    const {oldPassword, newPassword} = req.body
    if (!oldPassword || !newPassword) {
        throw new ErrorHandler("Please enter all the fields",400)
    }

    const student = await Student.findById(req.user._id)
    const isPasswordValid = await student.comparePassword(oldPassword)
    if (!isPasswordValid) {
        throw new ErrorHandler("Enter correct old password",401);
    }

    student.password = newPassword
    await student.save()

    sendToken(student, 200, res, "Password changed successfully")
});

//get student profile => /api/v1/student/details
export const getStudentProfile = catchAsyncError(async(req,res)=>{
    // console.log(req.user)
    const student = await Student.findById(req.user._id)
    if (!student) {
        throw new ErrorHandler("Student not found",404)
    }
    res.status(200).json({
        success:true,
        student
    })
});
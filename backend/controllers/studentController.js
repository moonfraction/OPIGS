import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Student from "../models/studentSchema.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {sendToken} from "../utils/jwtToken.js";
import RequestAlumni from "../models/requestAlumniSchema.js";

//register student => /api/v1/student/register
export const registerStudent = catchAsyncError( async (req, res) => {
    
    const {name,email,password,phone,branch,courseName,yearOfStudy,CGPA,address,profilePhoto} = req.body
    if(!name || !email || !phone || !courseName || !branch|| !password || !yearOfStudy ||!CGPA ||!address || !profilePhoto) {
        throw new ErrorHandler("Please enter all the fields", 400);
    }

    //check if student already exists
    const isEmail = await Student.findOne({email})
    if (isEmail) {
        throw new ErrorHandler("Student already exists with this email", 400);
    }
    //check if student already exists
    const isPhone = await Student.findOne({phone})
    if (isPhone) {
        throw new ErrorHandler("Student already exists with this phone number", 400);
    }

    //check if CGPA is between 0 and 10
    if (CGPA < 0 || CGPA > 10) {
        throw new ErrorHandler("CGPA must be between 0 and 10", 400);
    }

    const uploadedImg = await uploadOnCloudinary(profilePhoto);
    if(!uploadedImg){
        throw new ErrorHandler("Error while uploading image", 500);
    }
    //register student
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
        profilePhoto: uploadedImg.url
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

//update student profile => /api/v1/student/update
export const updateStudentProfile = catchAsyncError(async(req, res) => {
    const studentId = req.user._id || req.user.id;
    const student = await Student.findById(studentId)
    if (!student) {
        throw new ErrorHandler("Student not found",404)
    }
    
    const {name,email,phone,branch,courseName,yearOfStudy,CGPA,address} = req.body;
    //check if CGPA is between 0 and 10
    if(CGPA) {
        if (CGPA < 0 || CGPA > 10) {
            throw new ErrorHandler("CGPA must be between 0 and 10", 400);
        }
    }
    //check if email already exists
    if (email && email !== student.email) {
        const isEmail = await Student.findOne({ email })
        if (isEmail) throw new ErrorHandler("Student already exists with this email", 400);
    }
    //check if phone already exists
    const isPhone = await Student.findOne({phone});
    if(isPhone && isPhone.id.toString() !== studentId.toString()){
        throw new ErrorHandler("Student already exists with this phone number", 400);
    }

    const updatedStudent = {
        name: name || student.name,
        email: email || student.email,
        phone: phone || student.phone,
        branch: branch || student.branch,
        courseName: courseName || student.courseName,
        yearOfStudy: yearOfStudy || student.yearOfStudy,
        CGPA: CGPA || student.CGPA,
        address: address || student.address
    }

    //update profile photo
    let profilePhotoURLLocalPath;
    if(req.files && Array.isArray(req.files.profilePhoto) && req.files.profilePhoto.length > 0 ){
        profilePhotoURLLocalPath = req.files.profilePhoto[0].path
    }
    if (profilePhotoURLLocalPath) {
        const profilePhoto = await uploadOnCloudinary(profilePhotoURLLocalPath);
        if (!profilePhoto) {
            throw new ErrorHandler("Error while uploading profile photo",500);
        }
        updatedStudent.profilePhoto = profilePhoto.url
    }


    const updatedStudentProfile = await Student.findByIdAndUpdate
    (studentId, updatedStudent, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success:true,
        message:"Profile updated successfully",
        updatedStudentProfile
    });


});


//change password => /api/v1/student/changePassword
export const changePassword = catchAsyncError(async(req, res) => {
    const {oldPassword, newPassword} = req.body
    if (!oldPassword || !newPassword) {
        throw new ErrorHandler("Please enter old and new password",400)
    }
    if(oldPassword === newPassword){
        throw new ErrorHandler("Old password and new password cannot be same",400)
    }

    const studentId = req.user._id || req.user.id;
    const student = await Student.findById(studentId)
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
    const studentId = req.user._id || req.user.id;
    const student = await Student.findById(studentId)
    if (!student) {
        throw new ErrorHandler("Student not found",404)
    }
    res.status(200).json({
        success:true,
        student
    })
});

//request alumni => /api/v1/student/requestAlumni/:alum_id
export const requestAlumni = catchAsyncError(async(req,res)=>{
    const studentId = req.user._id || req.user.id;
    const student = await Student.findById(studentId)
    if (!student) {
        throw new ErrorHandler("Student not found",404)
    }
    const {alum_id} = req.params;
    const request = await RequestAlumni.create({
        student: studentId,
        alumni: alum_id,
        status
    })
    res.status(200).json({
        success:true,
        message:"Request sent successfully",
        request
    })
});
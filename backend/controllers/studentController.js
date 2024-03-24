import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Student from "../models/studentSchema.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {sendToken} from "../utils/jwtToken.js";

export const registerStudent = catchAsyncError( async (req, res) => {
    
    const {name,email,password,phone,branch,courseName,yearOfStudy,CGPA,address} = req.body
    if(!name || !email || !phone || !courseName || !branch|| !password || !yearOfStudy ||!CGPA ||!address) {
        throw new ErrorHandler("Please enter all the fields", 400);
    }

    const existedStudent = await Student.findOne({
        $or: [{ email }, { phone }]
    })
    if (existedStudent) {
        throw new ErrorHandler("Email already exists!", 400);
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
        address
    })
    return res.status(201).json({
        success: true,
        message : "Student registered successfully",
        student
    })

} )



export const loginStudent = catchAsyncError(async (req, res) =>{
    const {email, password} = req.body
    if (!email) {
        throw new ErrorHandler("Email is required" , 401)
    }
    

    const student = await Student.findOne({
        email
    })

    if (!student) {
        throw new ErrorHandler("Invalid email or password",401)
    }

   const isPasswordValid = await student.comparePassword(password)

   if (!isPasswordValid) {
    throw new ErrorHandler("Invalid Password", 401);
    }
    sendToken(student, 200, res, "Student logged in successfully!")

})

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


export const changePassword = catchAsyncError(async(req, res) => {
    const {oldPassword, newPassword} = req.body
    const {stu_id} = req.params
    const student = await Student.findById(stu_id)

    const isPasswordCorrect = await student.comparePassword(oldPassword)
    if (!isPasswordCorrect) {
        throw new ErrorHandler("Invalid existing password",401)
    }

    student.password = newPassword
    await student.save({validateBeforeSave: false})

    return res
    .status(200)
    .json({
        success:true,
        message:"Password updated successfully"
    })
})

// export const uploadResume = catchAsyncError(async(req,res)=>{
//     const {stu_id}= req.params
//     const student = await Student.findById(stu_id)
//     let resumeURLLocalPath;
//     if(req.files && Array.isArray(req.files.resume) && req.files.resume.length > 0 ){
//         resumeURLLocalPath = req.files.resume[0].path
//     }
//     if (!resumeURLLocalPath) {
//         throw new ErrorHandler("Please upload your resume",401)
//     }

//     const resume = await uploadOnCloudinary(resumeURLLocalPath)
//     if (!resume) {
//         throw new ErrorHandler("Error while uploading resume",401)
//     }

//     student.resume = resume.url
//     await student.save({validateBeforeSave: false})
//     // const user = await Student.findByIdAndUpdate(
//     //     req.user?._id,
//     //     {
//     //         $set:{
//     //             resume : resume.url
//     //         }
//     //     },
//     //     {new: true}
//     // ).select("-password")


//     return res
//     .status(200)
//     .json({
//         success:true,
//         message :"Resume uploaded successfully"
//     })
// })

export const uploadProfilePhoto = catchAsyncError (async(req,res,next)=>{
    const {id} = req.params;
    console.log(id);
    const student = await Student.findById(id);
    if(!student){
        return next(new ErrorHandler('Student not found',404))
    }
    // if(student.id !== req.user.id){
    //     return next(new ErrorHandler('You are not authorized to upload profile photo',401))
    // }
    let profilePhotoURLLocalPath;
    if(req.files && Array.isArray(req.files.profilePhoto) && req.files.profilePhoto.length > 0 ){
        profilePhotoURLLocalPa
        th = req.files.profilePhoto[0].path
    }
    if (!profilePhotoURLLocalPath) {
        return next (new ErrorHandler("Please upload your profile Photo",401))
    }

    const profilePhoto = await uploadOnCloudinary(profilePhotoURLLocalPath)
    if (!profilePhoto) {
        return next( new ErrorHandler("Error while uploading Profile Photo",401))
        
    }

    req.body.profilePhoto = profilePhoto.url;
    const uploaded = await Student.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    return res
    .status(200)
    .json({
        success:true,
        message :"Profile photo uploaded succesfully"
    }
    )
})

// export const viewAllJobs = catchAsyncError(async(req,res)=>{
//     const jobs = await Job.find({expired: false});
//     res.status(200).json({
//         success: true,
//         jobs
//     });
// })

export const studentNotifications = catchAsyncError(async(req,res)=>{


})

export const talkToAlumni = catchAsyncError(async(req,res)=>{

})

// export const getUser = catchAsyncError(async(req, res) => {
//     return res
//     .status(200)
//     .json(new ApiResponse(
//         200,
//         req.user,
//         "User fetched successfully"
//     ))
// })










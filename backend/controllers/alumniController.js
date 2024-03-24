import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Alumni from "../models/alumniSchema.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {sendToken} from "../utils/jwtToken.js";
import RequestAlumni from "../models/requestAlumniSchema.js";


const registerAlumni = catchAsyncError(async (req, res) => {
    const {username,email,password,phone,currentCompany,jobProfile,branch} = req.body;
    if(!username || !email || !password || !phone || !currentCompany || !jobProfile || !branch) {
        throw new ErrorHandler("Please enter all the fields", 400);
    }
    const alreadyExists = await Alumni.findOne({email});
    if(alreadyExists) {
        throw new ErrorHandler("Email already exists!", 400);
    }
    let avatarUrlLocalPath;
    console.log(req.files);
    if (req.files && Array.isArray(req.files.avatarAlumni) && req.files.avatarAlumni.length > 0) {
        avatarUrlLocalPath = req.files.avatarAlumni[0].path
    }
    if(!avatarUrlLocalPath){
        throw new ErrorHandler("Please upload an image", 400);
    }
    const avatar = await uploadOnCloudinary(avatarUrlLocalPath);
    if(!avatar){
        throw new ErrorHandler("Image upload failed", 500);
    }

    const alumni = await Alumni.create({
        username,
        email,
        password,
        phone,
        currentCompany,
        jobProfile,
        branch,
        avatar:avatar.url
    });
    console.log(req.body);
    
    res.json({
        success: true,
        message: "Alumni registered successfully",
        alumni
    });
    
});

const loginAlumni = catchAsyncError(async (req,res) => {
    const {email,password} = req.body;
    if(!email || !password){
        throw new ErrorHandler("Please enter email and password", 400);
    }
    const alumni = await Alumni.findOne({email});
    if(!alumni){
        throw new ErrorHandler("Invalid Email or Password", 401);
    }
    const passwordMatch = await alumni.comparePassword(password);
    if(!passwordMatch){
        throw new ErrorHandler("Invalid Password or Password", 401);
    }
    
    sendToken(alumni, 200, res, "Alumni logged in successfully");
})

const logoutAlumni = catchAsyncError((async (req,res) => {
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    });
    res.status(200).json({
        success:true,
        message:"Logout successful"
    });
}))

const approveRequest = catchAsyncError(async (req,res) => {
    const {id} = req.params;
    const request = await RequestAlumni.findById(id);
    if(!request){
        throw new ErrorHandler("Request not found", 404);
    }
    request.status = true;
    await request.save();
    res.status(200).json({
        success:true,
        message:"Request approved successfully",
        request
    });
})

const getAllAlumni = catchAsyncError(async (req,res,next) => {
    const alum_data = await Alumni.find({});
    if(!alum_data){
        next(new ErrorHandler("Could not fetch alumni or no alumni available",500));
    }
    res.status(200).json({
        success:true,
        message:"Alumni fetched successful",
        alum_data
    })
})

const updateAlumniProfile = catchAsyncError(async (req, res, next) => {
    const id = req.user._id;
    let alumni = await Alumni.findById(id);
    if (!alumni) {
        return next(new ErrorHandler('Alumni not found', 404));
    }
    console.log(req.body);
    const updatedAlumni = await Alumni.findByIdAndUpdate(req.user._id
        , req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });
    res.status(200).json({
        success: true,
        message: 'Company updated successfully',
        updatedAlumni
    });
});

const updateAlumniAvatar = catchAsyncError(async (req,res,next) => {
    const id = req.user._id;
    let alumni = await Alumni.findById(id);
    let avatarUrlLocalPath;
    if (req.files && Array.isArray(req.files.avatarAlumni) && req.files.avatarAlumni.length > 0) {
        avatarUrlLocalPath = req.files.avatarAlumni[0].path
    }
    if(!avatarUrlLocalPath){
        throw new ErrorHandler("Please upload an image", 400);
    }
    const avatar = await uploadOnCloudinary(avatarUrlLocalPath);
    if(!avatar){
        throw new ErrorHandler("Image upload failed", 500);
    }
    alumni.avatar = avatar.url;
    await alumni.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
        alumni
    })
})

export {registerAlumni,loginAlumni,approveRequest,logoutAlumni,getAllAlumni,updateAlumniProfile,updateAlumniAvatar}


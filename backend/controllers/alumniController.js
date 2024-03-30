import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Alumni from "../models/alumniSchema.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {sendToken} from "../utils/jwtToken.js";
import RequestAlumni from "../models/requestAlumniSchema.js";

//register alumni => /api/v1/alumni/register
const registerAlumni = catchAsyncError(async (req, res) => {
    const {username,email,password,phone,currentCompany,jobProfile,branch,avatar} = req.body;
    if(!username || !email || !password || !phone || !currentCompany || !jobProfile || !branch) {
        throw new ErrorHandler("Please enter all the fields", 400);
    }
    const alreadyExists = await Alumni.findOne({email});
    if(alreadyExists) {
        throw new ErrorHandler("Email already exists!", 400);
    }
    const isPhone = await Alumni.findOne({phone});
    if(isPhone) {
        throw new ErrorHandler("Phone number already exists!", 400);
    }

    const uploadedImg= await uploadOnCloudinary(avatar);
    if(!uploadedImg){
        throw new ErrorHandler("Error while uploading image", 500);
    }

    const alumni = await Alumni.create({
        username,
        email,
        password,
        phone,
        currentCompany,
        jobProfile,
        branch,
        avatar:uploadedImg.url
    });
    
    res.json({
        success: true,
        message: "Alumni registered successfully",
        alumni
    });
    
});

//login alumni => /api/v1/alumni/login
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
        throw new ErrorHandler("Invalid Email or Password", 401);
    }
    
    sendToken(alumni, 200, res, "Alumni logged in successfully");
})

//logout alumni => /api/v1/alumni/logout
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

//see all requests => /api/v1/alumni/requests
const seeAllRequests = catchAsyncError(async (req,res) => {
    const alumId= req.user._id || req.user.id;
    const alumni = await Alumni.findById(alumId);
    if(!alumni){
        throw new ErrorHandler("Alumni not found", 404);
    }
    const requests = await RequestAlumni.find({alumni:alumId, status:false});
    res.status(200).json({
        success:true,
        message:"Requests fetched successfully",
        requests
    });
})

//see one request => /api/v1/alumni/request/:id
const seeOneRequest = catchAsyncError(async (req,res) => {
    const {id} = req.params;
    const alumId= req.user._id || req.user.id;
    const alumni = await Alumni.findById(alumId);
    if(!alumni){
        throw new ErrorHandler("Alumni not found", 404);
    }
    const request = await RequestAlumni.findById(id);
    if(!request){
        throw new ErrorHandler("Request not found", 404);
    }
    if(request.alumni.toString() !== alumId.toString()){
        throw new ErrorHandler("You are not authorized to view this request", 401);
    }
    res.status(200).json({
        success:true,
        message:"Request fetched successfully",
        request
    });

})

//approve request => /api/v1/alumni/request/:id/approve
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

//delete request => /api/v1/alumni/request/:id/delete
const deleteRequest = catchAsyncError(async (req,res) => {
    const {id} = req.params;
    const request = await RequestAlumni.findById(id);
    if(!request){
        throw new ErrorHandler("Request not found", 404);
    }
    await request.deleteOne();
    res.status(200).json({
        success:true,
        message:"Request deleted successfully"
    });
})

//get all alumni => /api/v1/alumni/getall
const getAllAlumni = catchAsyncError(async (req,res,next) => {
    const alum_data = await Alumni.find({});
    if(!alum_data){
        next(new ErrorHandler("Could not fetch alumni or no alumni available",500));
    }
    res.status(200).json({
        success:true,
        message:"Alumni fetched successfully",
        alum_data
    })
})

//update alumni profile => /api/v1/alumni/update
const updateAlumniProfile = catchAsyncError(async (req, res, next) => {
    const alumId = req.user._id || req.user.id;
    let alumni = await Alumni.findById(alumId);
    if (!alumni) {
        return next(new ErrorHandler('Alumni not found', 404));
    }
    const {username,email,phone,currentCompany,jobProfile,branch} = req.body;
    if(email && email !== alumni.email){
        const isEmail = await Alumni.findOne({ email });
        if(isEmail) return next(new ErrorHandler('Alumni already exists with this email', 400));
    }
    const isPhone = await Alumni.findOne({ phone });
    if(isPhone && isPhone.id.toString() !== alumId.toString()){
        return next(new ErrorHandler('Alumni already exists with this phone number', 400));
    }

    const updatedAlumni = {
        username: username || alumni.username,
        email: email || alumni.email,
        phone: phone || alumni.phone,
        currentCompany: currentCompany || alumni.currentCompany,
        jobProfile: jobProfile || alumni.jobProfile,
        branch: branch || alumni.branch
    };

    let avatarUrlLocalPath;
    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        avatarUrlLocalPath = req.files.avatar[0].path
    }
    if (avatarUrlLocalPath) {
        const avatar = await uploadOnCloudinary(avatarUrlLocalPath);
        if (!avatar) {
            return next(new ErrorHandler('Error while uploading avatar', 500));
        }
        updatedAlumni.avatar = avatar.url
    }

    const updatedAlumniProfile = await Alumni.findByIdAndUpdate
        (alumId, updatedAlumni, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

    res.status(200).json({
        success: true,
        message: 'Alumni profile updated successfully',
        updatedAlumniProfile
    });
});

//change password => /api/v1/alumni/changePassword
const changePassword = catchAsyncError(async (req, res, next) => {
    const alumId = req.user._id || req.user.id;
    const alumni = await Alumni.findById(alumId);
    if (!alumni) {
        return next(new ErrorHandler('Alumni not found', 404));
    }
    const { oldPassword, newPassword } = req.body;
    if(!oldPassword || !newPassword){
        return next(new ErrorHandler("Please enter old and new password", 400));
    }
    if(oldPassword === newPassword){
        return next(new ErrorHandler("Old password and new password cannot be same", 400));
    }
    const passwordMatch = await alumni.comparePassword(oldPassword);
    if (!passwordMatch) {
        return next(new ErrorHandler('Enter correct old password', 400));
    }
    alumni.password = newPassword;
    await alumni.save();
    sendToken(alumni, 200, res, "Password changed successfully");
});


export {registerAlumni,loginAlumni,approveRequest,logoutAlumni,getAllAlumni,updateAlumniProfile, seeAllRequests, seeOneRequest, deleteRequest, changePassword};


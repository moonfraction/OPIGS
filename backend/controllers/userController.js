import {catchAsyncError} from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import User from "../models/userSchema.js";
import {sendToken} from "../utils/jwtToken.js"

export const register = catchAsyncError(async (req, res, next) => {
    const {name, email, phone, role, password} = req.body;

    if(!name || !email || !phone || !role || !password) {
        return next(new ErrorHandler("Please enter all the fields", 400));
    }
    const isEmail = await User.findOne({email});
    if(isEmail) {
        return next(new ErrorHandler("Email already exists!", 400));
    }
    const user = await User.create({
        name,
        email,
        phone,
        role,
        password
    });
    // res.status(201).json({
    //     success: true,
    //     message: "User registered successfully",
    //     user
    // });
    sendToken(user, 201, res, "User registered succesfully!")
});


export const login = catchAsyncError(async (req, res, next) => {
    const {email, password, role} = req.body;
    if(!email || !password || !role) {
        return next(new ErrorHandler("Please provide email, password and role", 400));
    }
    const user = await User.findOne({email}).select("+password");
    if(!user) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }
    if(user.role !== role) {
        return next(new ErrorHandler("Invalid Role", 401));
    }

    sendToken(user, 201, res, "User logged in successfully!");
});

export const logout = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(201).json({
        success: true,
        message: "User logged out successfully!"
    });
});

export const getUser = catchAsyncError((req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user
    });
}); 
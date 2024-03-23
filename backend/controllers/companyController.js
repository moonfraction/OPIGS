import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Company from "../models/companySchema.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { sendToken } from "../utils/jwtToken.js";

// register company => /api/v1/company/register
export const registerCompany = catchAsyncError(async (req, res, next) => {
    const { name, email, password, recruitmentPolicy, workEnvironment, location, website, phone } = req.body;

    if (!name || !email || !password || !recruitmentPolicy || !workEnvironment || !location || !website || !phone) {
        return next(new ErrorHandler('Please enter all the fields', 400));
    }

    const isEmail = await Company.findOne({ email });
    if (isEmail) {
        return next(new ErrorHandler('Company already exists with this email', 400));
    }

    let logoUrlLocalPath;
    if (req.files && Array.isArray(req.files.logo) && req.files.logo.length > 0) {
        logoUrlLocalPath = req.files.logo[0].path
    }
    if (!logoUrlLocalPath) {
        return next(new ErrorHandler('Please upload an image', 400));
    }
    const logo = await uploadOnCloudinary(logoUrlLocalPath);
    if (!logo) {
        return next(new ErrorHandler('Image upload failed', 500));
    }


    const company = await Company.create({
        name,
        email,
        password,
        phone,
        recruitmentPolicy,
        workEnvironment,
        location,
        website,
        logo: logo.url
    });

    res.json({
        success: true,
        message: 'Company registered successfully',
        company
    });

});

// login company => /api/v1/company/login
export const loginCompany = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    // check if email and password is entered by company
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400))
    }

    // finding company in database
    const company = await Company.findOne({ email });
    if (!company) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }
    // check if password is correct
    const isPasswordMatched = company.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    sendToken(company, 200, res, 'Company logged in successfully');
});

// logout company => /api/v1/company/logout
export const logoutCompany = catchAsyncError(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'Logged out'
    });
});

// get company profile => /api/v1/company/:id
export const getCompanyProfile = catchAsyncError(async (req, res, next) => {
    const company = await Company.findById(req.params.id);
    if (!company) {
        return next(new ErrorHandler(`Company does not exist with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        company
    });
});

// update logged in company profile => /api/v1/company/update
export const updateCompanyProfile = catchAsyncError(async (req, res, next) => {
    const { id } = req.user;
    let company = await Company.findById(id);
    if (!company) {
        return next(new ErrorHandler('Company not found', 404));
    }
    if (company.id !== req.user.id) {
        return next(new ErrorHandler('You are not authorized to update this company', 401));
    }
    let logoUrlLocalPath;
    if (req.files && Array.isArray(req.files.logo) && req.files.logo.length > 0) {
        logoUrlLocalPath = req.files.logo[0].path
    }
    if (!logoUrlLocalPath) {
        return next(new ErrorHandler('Please upload an image', 400));
    }
    const logo = await uploadOnCloudinary(logoUrlLocalPath);
    if (!logo) {
        return next(new ErrorHandler('Image upload failed', 500));
    }
    req.body.logo = logo.url;
    const updatedCompany = await Company.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        message: 'Company updated successfully',
        updatedCompany
    });
});

// apply for company 
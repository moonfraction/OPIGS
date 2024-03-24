import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Company from "../models/companySchema.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { sendToken } from "../utils/jwtToken.js";
import Verification from "../models/verificationSchema.js";
import Student from "../models/studentSchema.js";

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
        return next(new ErrorHandler('Please upload a logo', 400));
    }
    const logo = await uploadOnCloudinary(logoUrlLocalPath);
    if (!logo) {
        return next(new ErrorHandler('Logo upload failed', 500));
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
        logo: logo.url,
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
    console.log(req.body);

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
    const isPasswordMatched = await company.comparePassword(password);
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

// get company profile => /api/v1/company/details
export const getCompanyProfile = catchAsyncError(async (req, res, next) => {
    const company = await Company.findById(req.user.id);
    if (!company) {
        return next(new ErrorHandler('Company not found', 404));
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


//apply for verification => /api/v1/company/apply
//admin will see the verification request, change status to APPROVED or REJECTED
export const applyForVerification = catchAsyncError(async (req, res, next) => {
    const { id } = req.user;
    let company = await Company.findById(id);
    if (!company) {
        return next(new ErrorHandler('Company not found', 404));
    }
    if (company.status === 'Approved') {
        return next(new ErrorHandler('Company is already verified', 400));
    }
    
    let verification = await Verification.findOne({ company: id });
    if (verification) {
        return next(new ErrorHandler('Verification request already sent', 400));
    }
    verification = await Verification.create({
        company: id,
    });

    //change status to 'pending' in db
    await Company .findByIdAndUpdate(id, {
        status: 'Pending'
    });

    res.status(200).json({
        success: true,
        message: 'Verification request sent successfully',
        verification
    });
});


//get all students => /api/v1/company/students
export const getAllStudents = catchAsyncError(async (req, res, next) => {
    const students = await Student.find();
    if (!students) {
        return next(new ErrorHandler('No students found', 404));
    }
    res.status(200).json({
        success: true,
        students
    });
});

//get one student => /api/v1/company/student/:id
export const getOneStudent = catchAsyncError(async (req, res, next) => {
    const student = await Student.findById(req.params.id);
    if (!student) {
        return next(new ErrorHandler('Student not found', 404));
    }
    res.status(200).json({
        success: true,
        student
    });
});

import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Company from "../models/companySchema.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { sendToken } from "../utils/jwtToken.js";
import Verification from "../models/verificationSchema.js";
import Student from "../models/studentSchema.js";

// register company => /api/v1/company/register
export const registerCompany = catchAsyncError(async (req, res, next) => {
  const {
    name,
    email,
    password,
    recruitmentPolicy,
    workEnvironment,
    location,
    website,
    phone,
    logo,
  } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    !recruitmentPolicy ||
    !workEnvironment ||
    !location ||
    !website ||
    !phone
  ) {
    return next(new ErrorHandler("Please enter all the fields", 400));
  }

  const isEmail = await Company.findOne({ email });
  if (isEmail) {
    return next(
      new ErrorHandler("Company already exists with this email", 400)
    );
  }
  const isPhone = await Company.findOne({ phone });
  if (isPhone) {
    return next(
      new ErrorHandler("Company already exists with this phone number", 400)
    );
  }

  const uploadedPhoto = await uploadOnCloudinary(logo);
  if (!uploadedPhoto) {
    return next(new ErrorHandler("Error while uploading image", 500));
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
    logo: uploadedPhoto.url,
  });

  res.json({
    success: true,
    message: "Company registered successfully",
    company,
  });
});

// login company => /api/v1/company/login
export const loginCompany = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  // check if email and password is entered by company
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  // finding company in database
  const company = await Company.findOne({ email });
  if (!company) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }
  // check if password is correct
  const isPasswordMatched = await company.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  sendToken(company, 200, res, "Company logged in successfully");
});

// logout company => /api/v1/company/logout
export const logoutCompany = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

// get company profile => /api/v1/company/details
export const getCompanyProfile = catchAsyncError(async (req, res, next) => {
  const companyId = req.user.id || req.user._id;
  const company = await Company.findById(companyId);
  if (!company) {
    return next(new ErrorHandler("Company not found", 404));
  }
  res.status(200).json({
    success: true,
    company,
  });
});

// update logged in company profile => /api/v1/company/update
// cannot change password here
export const updateCompanyProfile = catchAsyncError(async (req, res, next) => {
  const companyId = req.user.id || req.user._id;
  const company = await Company.findById(companyId);
  if (!company) {
    return next(new ErrorHandler("Company not found", 404));
  }
  if (company.id !== companyId) {
    return next(
      new ErrorHandler("You are not authorized to update this company", 401)
    );
  }

  const {
    name,
    email,
    phone,
    recruitmentPolicy,
    workEnvironment,
    location,
    website,
  } = req.body;

  if (email && email !== company.email) {
    const isEmail = await Company.findOne({ email });
    if (isEmail)
      return next(
        new ErrorHandler("Company already exists with this email", 400)
      );
  }
  const isPhone = await Company.findOne({ phone });
  if (isPhone && isPhone.id.toString() !== companyId.toString()) {
    return next(
      new ErrorHandler("Company already exists with this phone number", 400)
    );
  }

  const updatedCompany = {
    name: name || company.name,
    email: email || company.email,
    phone: phone || company.phone,
    recruitmentPolicy: recruitmentPolicy || company.recruitmentPolicy,
    workEnvironment: workEnvironment || company.workEnvironment,
    location: location || company.location,
    website: website || company.website,
  };

  let logoUrlLocalPath;
  if (req.files && Array.isArray(req.files.logo) && req.files.logo.length > 0) {
    logoUrlLocalPath = req.files.logo[0].path;
  }
  if (logoUrlLocalPath) {
    const logo = await uploadOnCloudinary(logoUrlLocalPath);
    if (!logo) {
      return next(new ErrorHandler("Logo upload failed", 500));
    }
    updatedCompany.logo = logo.url;
  }

  const updatedCompanyProfile = await Company.findByIdAndUpdate(
    companyId,
    updatedCompany,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Company profile updated successfully",
    updatedCompanyProfile,
  });
});

//change password => /api/v1/company/changePassword
export const changePassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return next(new ErrorHandler("Please enter old and new password", 400));
  }
  if (oldPassword === newPassword) {
    return next(
      new ErrorHandler("Old password and new password cannot be same", 400)
    );
  }
  const companyId = req.user.id || req.user._id;
  const company = await Company.findById(companyId);
  if (!company) {
    return next(new ErrorHandler("Company not found", 404));
  }
  const isPasswordMatched = await company.comparePassword(oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }
  company.password = newPassword;
  await company.save();
  sendToken(company, 200, res, "Password changed successfully");
});

//apply for verification => /api/v1/company/apply
//admin will see the verification request, change status to APPROVED or REJECTED
export const applyForVerification = catchAsyncError(async (req, res, next) => {
  const { _id } = req.user;
  let company = await Company.findById(_id);
  if (!company) {
    return next(new ErrorHandler("Company not found", 404));
  }
  if (company.status === "Approved") {
    return next(new ErrorHandler("Company is already approved", 400));
  }

  let verification = await Verification.findOne({ company: _id });
  if (verification) {
    return next(new ErrorHandler("Verification request already sent", 400));
  }
  verification = await Verification.create({
    company: _id,
  });

  //change status to 'pending' in db
  await Company.findByIdAndUpdate(_id, {
    status: "Pending",
  });

  res.status(200).json({
    success: true,
    message: "Verification request sent successfully",
    verification,
  });
});

//get all students => /api/v1/company/students
export const getAllStudents = catchAsyncError(async (req, res, next) => {
  const students = await Student.find();
  if (!students) {
    return next(new ErrorHandler("No students found", 404));
  }
  res.status(200).json({
    success: true,
    students,
  });
});

//get one student => /api/v1/company/student/:id
export const getOneStudent = catchAsyncError(async (req, res, next) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    return next(new ErrorHandler("Student not found", 404));
  }
  res.status(200).json({
    success: true,
    student,
  });
});


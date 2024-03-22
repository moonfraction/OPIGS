import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Alumni from "../models/alumniSchema.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import sendToken from "../utils/jwtToken.js";


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

    sendToken(alumni, 200, res, "Alumni registered successfully");
    
});

const loginAlumni = catchAsyncError(async (req,res) => {
    const {email,password} = req.body;
    const alumni = await Alumni.findOne({email});
    if(!alumni){
        throw new ErrorHandler("Invalid Email or Password", 401);
    }
    const passwordMatch = alumni.comparePassword(password);
    if(!passwordMatch){
        throw new ErrorHandler("Invalid Password", 401);
    }
    
    sendToken(alumni, 200, res, "Alumni logged in successfully");
})

const approveRequest = catchAsyncError(async (req,res) => {
    const {stu_id} = req.params;
    const stu = Student.findOne({stu_id});
    const token = req.cookies();
    const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    const alum = await Alumni.findById(decoded.id);
    for(const singleRequest of stu.requests){
        if(singleRequest.alumni._id == alum._id){
            singleRequest.status = 1;
        }
    }
})

export {registerAlumni,loginAlumni,approveRequest}
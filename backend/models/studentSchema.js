import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        validate: [validator.isEmail, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
        minLength: [8, 'Password must be at least 8 characters'],
        maxLength: [30, 'Password must be at most 30 characters']
    },
    phone: {
        type: Number,
        required: [true, 'Phone number is required'],
        unique: true,
    },
    branch: {
        type: String,
        required: [true, 'Branch is required']
    },
    courseName: {
        type: String,
        required: [true, 'CourseName is required']
    },
    yearOfStudy: {
        type: Number,
        required: [true, 'Enter your yearofGraduation']
    },
    CGPA: {
        type: mongoose.Types.Decimal128,
        required: true,        
    },
    address: {
        type: String,
        required: true,
    },
    profilePhoto: {
        type: String, //get from cloudinary
        required: [true, 'Upload your profile photo']
    },
    resume:{
        type: String,
        default: ""
    },
    roll :{
        type: String,
        required: [true, 'Roll number is required'],
    },
}, { timestamps: true })


studentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
});


studentSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}


studentSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            role: "student"
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


const Student = mongoose.model('Student', studentSchema);
export default Student;
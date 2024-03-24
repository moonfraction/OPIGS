import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const applicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minLength: [3, 'Name must be at least 3 characters'],
        maxLength: [30, 'Name must be at most 50 characters'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    coverLetter: {
        type: String,
        required: [true, 'Cover Letter is required'],
        maxLength: [500, 'Cover Letter must be at most 500 characters'],
        trim: true
    },
    phone: {
        type: Number,
        required: [true, 'Phone number is required'],
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        minLength: [10, 'Address must be at least 10 characters'],
        maxLength: [100, 'Address must be at most 100 characters'],
        trim: true
    },
    resume:{
        type: String,
        required: true
    },
    applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Student",
        required : true,
    },
    jobId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Job",
        required : true
    },
    status: {
        type: String,
        default: 'Pending'
        // enum: ['Approved', 'Rejected'],
        //dropdown in frontend ['Approved', 'Rejected']
    }
})

const Application = mongoose.model("Application",applicationSchema)
export default Application;
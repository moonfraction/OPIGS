import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter Company name'],
        trim: true,
        minlength: [3, 'Company name must be at least 3 characters long'],
        maxlength: [50, 'Company name must be at most 50 characters long']
    },
    email: {
        type: String,
        required: [true, 'Please enter Company email'],
        trim: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter Company password'],
        minlength: [8, 'Password must be at least 8 characters long'],
        maxlength: [30, 'Password must be at most 30 characters long'],
    },
    phone: {
        type: Number,
        required: [true, 'Please enter Company phone number'],
        unique: true,
    },
    recruitmentPolicy: {
        type: String,
        required: [true, 'Please enter Company recruitment policy'],
        trim: true,
        minlength: [10, 'Company recruitment policy must be at least 10 characters long'],
        maxlength: [500, 'Company recruitment policy must be at most 500 characters long']
    },
    workEnvironment: {
        type: String,
        required: [true, 'Please enter Company work environment'],
        trim: true,
        minlength: [10, 'Company work environment must be at least 10 characters long'],
        maxlength: [500, 'Company work environment must be at most 500 characters long']
    },
    location: {
        type: String,
        required: [true, 'Please enter Company location'],
        trim: true,
        minlength: [3, 'Company location must be at least 3 characters long'],
        maxlength: [50, 'Company location must be at most 50 characters long']
    },
    website: {
        type: String,
        required: [true, 'Please enter Company website'],
        trim: true,
        validate: [validator.isURL, 'Please enter a valid URL']
    },
    logo: {
        //logo is uploaded to cloudinary as image
        type: String,
        required: [true, 'Please upload Company logo'],
    },
    isverified: {
        type: String,
        default: 'Not Verified'
    },
    status: {
        type: String,
        default: 'Not applied for verification'
    }
}, {
    timestamps: true
});


// Encrypt password before saving
companySchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// Check if password is correct
companySchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compareSync(enteredPassword, this.password);
};


// Generate JWT token
companySchema.methods.generateAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
};


const Company = mongoose.model('Company', companySchema);
export default Company;
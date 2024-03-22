import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Define the alumni schema i.e. the structure of the alumni object
const alumniSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Name is required'],
        minLength: [3, 'Name must be at least 3 characters'],
        maxLength: [30, 'Name must be at most 50 characters'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        validate: [validator.isEmail, 'Please enter a valid email address']
    },
    currentCompany: {
        type: String,
        required: [true, 'Current company is required'],
        trim: true
    },
    phone: {
        type: Number,
        required: [true, 'Phone number is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
        minLength: [8, 'Password must be at least 8 characters'],
        maxLength: [30, 'Password must be at most 30 characters']
    },
    jobProfile: {
        type: String,
        required: [true, 'Role is required'],
        enum: ['SDE', 'Consult', 'Quant'],
        default: 'SDE'
    },
    branch: {
        type: String,
        required: [true, 'Branch is required'],
        default: 'CSE'
    },
    avatar:{
        type:String,
        required:[true, 'Uploading an image is mandatory'],

    },
    requests:[
        {            
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",            
        }
    ]
    }
    ,{timestamps: true}
);

// Hash the password before saving the alumni
alumniSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

//Compare the entered password with the hashed password in the database
alumniSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// Generate a jwt token for the alumni for authoriztion
alumniSchema.methods.generateAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
}
// Create the alumni model
const Alumni = mongoose.model('Alumni', alumniSchema);

export default Alumni;
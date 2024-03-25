import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { catchAsyncError } from '../middlewares/catchAsyncError.js';

const adminSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true, 'Email is required'],
    },
    password:{
        type: String,
        required: [true, 'Password is required'],
    }
})

adminSchema.pre("save", async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

adminSchema.methods.generateAccessToken = function(){
    return jwt.sign({id: this._id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
}

adminSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
}

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;


















































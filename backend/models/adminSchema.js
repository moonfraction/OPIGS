import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { catchAsyncError } from '../middlewares/catchAsyncError';

const adminSchema = new mongoose.Schema({
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

adminSchema.methods.generateAccessToken = catchAsyncError(async (req,res) =>{
    return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
})

const Alumni = mongoose.model('Admin', adminSchema);
export default Alumni;


















































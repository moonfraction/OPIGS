import mongoose from 'mongoose';
import validator from 'validator';

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
        unique: true,
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
        minLength: [50, 'Cover Letter must be at least 50 characters'],
        maxLength: [500, 'Cover Letter must be at most 500 characters'],
        trim: true
    },
    phone: {
        type: Number,
        required: [true, 'Phone number is required'],
        unique: true,
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        minLength: [10, 'Address must be at least 10 characters'],
        maxLength: [100, 'Address must be at most 100 characters'],
        trim: true
    },
    resume: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    applicantId: {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        role: {
            type: String,
            required: true,
            enum: ['Job Seeker'],
        }
    },
    employerId: {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        role: {
            type: String,
            required: true,
            enum: ['Employer'],
        }
    },
});

const Application = mongoose.model('Application', applicationSchema);
export default Application;
import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    category: {
        type: String,
        required: [true, 'Select Job category'],
        trim: true
        //dropdown in frontend ['IT', 'Software Development', 'Consulting', 'Finance', 'Data Science', 'Product Management', 'Design', 'Marketing', 'Human Resources', 'Operations', 'Sales', 'Customer Support', 'Research', 'Content Writing', 'Teaching', 'Healthcare', 'Others']
    },
    title: {
        type: String,
        required: [true, 'Please enter Job title'],
        trim: true,
        minlength: [3, 'Job title must be at least 3 characters long'],
        maxlength: [50, 'Job title must be at most 50 characters long']
    },
    description: {
        type: String,
        required: [true, 'Please enter Job description'],
        trim: true,
        minlength: [10, 'Job description must be at least 10 characters long'],
        maxlength: [500, 'Job description must be at most 500 characters long']
    },
    location: {
        type: String,
        required: [true, 'Please enter Job location'],
        trim: true,
        minlength: [3, 'Job location must be at least 3 characters long'],
        maxlength: [50, 'Job location must be at most 50 characters long']
    },
    fixedSalary: {
        type: Number,
        trim: true,
        minLength: [5, 'Fixed Salary must be at least 5 digits'],
        maxLength: [10, 'Fixed Salary must not exceed 10 digits']
    },
    salaryFrom: {
        type: Number,
        trim: true,
        minLength: [5, 'Salary from must be at least 5 digits'],
        maxLength: [10, 'Salary from must not exceed 10 digits']
    },
    salaryTo: {
        type: Number,
        trim: true,
        minLength: [5, 'Salary to must be at least 5 digits'],
        maxLength: [10, 'Salary to must not exceed 10 digits']
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Please enter Company']
    },
    jobType: {
        type: String,
        required: [true, 'Please enter Job type'],
        trim: true
        //dropdown in frontend ['Full-time', 'Part-time', 'Internship', 'Contract']
    },
    postedOn: {
        type: Date,
        default: Date.now
    },
    deadline: {
        type: Date,
        required: [true, 'Please enter Job deadline']
    },
    expired: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

export default Job;

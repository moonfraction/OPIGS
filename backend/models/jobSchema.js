import mongoose from 'mongoose';

// Define the job schema i.e. the structure of the job object
const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minLength: [3, 'Title must be at least 3 characters'],
        maxLength: [50, 'Title must be at most 50 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        minLength: [10, 'Description must be at least 10 characters'],
        maxLength: [500, 'Description must be at most 500 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    country: {
        type: String,
        required: [true, 'Job country is required'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Job location is required'],
        trim: true,
        minLength: [20, 'Location must be at least 20 characters'],

    },
    fixedSalary: {
        type: Number,
        // required: [true, 'Salary is required'],
        trim: true,
        minLength: [5, 'Fixed Salary must be at least 5 digits'],
        maxLength: [10, 'Fixed Salary must not exceed 10 digits']
    },
    salaryFrom: {
        type: Number,
        // required: [true, 'Salary is required'],
        trim: true,
        minLength: [5, 'Salary from must be at least 5 digits'],
        maxLength: [10, 'Salary from must not exceed 10 digits']
    },
    salaryTo: {
        type: Number,
        // required: [true, 'Salary is required'],
        trim: true,
        minLength: [5, 'Salary to must be at least 5 digits'],
        maxLength: [10, 'Salary to must not exceed 10 digits']
    },
    expired: {
        type: Boolean,
        default: false
    },
    jobPostedOn: {
        type: Date,
        default: Date.now
    },
    jobPostedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Job Posted by is required']
    },
    company: {
        type: String,
        required: [true, 'Company is required'],
        trim: true
    },
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
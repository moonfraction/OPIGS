import mongoose from "mongoose";

//When a company posts a job, the job is sent to all users as a notification.
const generalNotifSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter Notification title'],
        trim: true,
    },
    description:{
        type: String,
        required: [true, 'Please enter Notification description'],
        trim: true,
    }
    }
    ,{timestamps: true});

const GeneralNotification = mongoose.model('GeneralNotification', generalNotifSchema);

export default GeneralNotification;
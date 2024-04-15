import mongoose from "mongoose";

//When a company posts a job, the job is sent to all users as a notification.
const toAllNotificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter Notification title'],
        trim: true,
        minlength: [3, 'Notification title must be at least 3 characters long'],
        maxlength: [50, 'Notification title must be at most 50 characters long']
    },
    company: {
        type: String,
        required: [true, 'Please enter Company']
    },
    postedOn: {
        type: Date,
        default: Date.now()
    }
});

const ToAllNotif = mongoose.model('ToAllNotif', toAllNotificationSchema);

export default ToAllNotif;
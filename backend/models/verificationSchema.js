import mongoose from 'mongoose';

//company apply for verification to admin
const verificationSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Please enter Company']
    },
    status: {
        type: String,
        // enum: ['Pending', 'Approved', 'Rejected'],
        //dropdown in frontend ['Pending', 'Approved', 'Rejected']
        default: 'Pending'
    }
}, {timestamps: true});    

const Verification = mongoose.model('Verification', verificationSchema);

export default Verification;

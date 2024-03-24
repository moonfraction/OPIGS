import mongoose from "mongoose";

//When a stuendt sends a request to a alumni, a object is added with student, alumni and status
const requestAlumniSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Student"
    },
    alumni: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Alumni"
    },
    status: {
        type: Boolean,
        ref : "false"
    },
});

const RequestAlumni = mongoose.model('RequestAlumni', requestAlumniSchema);

export default RequestAlumni;
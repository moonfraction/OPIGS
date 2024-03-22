import mongoose from "mongoose";
import ErrorHandler from "../middlewares/error.js";

export const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "OPIGS_db",
    }).then((obj) => {
        console.log(`Connected to MongoDB ${obj.connection.host}`);
    }).catch((err) => {
        throw new ErrorHandler(`Failed to connect to MongoDB : ${err.message}`,500);
    });
}

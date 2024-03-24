import mongoose from "mongoose";
import ErrorHandler from "../middlewares/error.js";

export const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "OPIGS_db",
    }).then((obj) => { 
        const data = mongoose.connection.db.collection("alumnis");
        data.find({}).toArray(function(err,result){
            console.log("HI");

            if(err){
                throw new ErrorHandler("Not able to fetch Data", 500);
            }
            // global.data_alumni = data;
        })
        // console.log(data);
        console.log(`Connected to MongoDB ${obj.connection.host}`);
    }).catch((err) => {
        throw new ErrorHandler(`Failed to connect to MongoDB : ${err.message}`,500);
    });
}

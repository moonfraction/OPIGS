import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import ErrorHandler from "../middlewares/error.js";


const uploadOnCloudinary = async (file) => {
    try {
        const response = await cloudinary.uploader.upload(file, {
            resource_type: "auto",
            folder: "project"
        })
        return response;

    } catch (error) {
        throw new ErrorHandler("Error while uploading image on cloudinary", 500);
    }
}

export {uploadOnCloudinary}
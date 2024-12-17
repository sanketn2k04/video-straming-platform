import { v2 as cloudinary } from 'cloudinary';
import { ALL } from 'dns';
import fs from 'fs';

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SECRET_KEY,
});

const uploadOnCloudinary=async (localFilePath)=>{
    try {
        if(!localFilePath) return null;

        //upload on cloudinary

        const cloudinaryResponse=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file has been uploaded
        // console.log("File has been succesfully uploded!");
        // console.log("File link: ",cloudinaryResponse.url);
        fs.unlinkSync(localFilePath)
        return cloudinaryResponse;
    } catch (error) {
        // console.log(localFilePath)
        fs.unlinkSync(localFilePath)//remove the locally saved temporary file as upload operation got failed
        return null;
    }
}

export {uploadOnCloudinary};
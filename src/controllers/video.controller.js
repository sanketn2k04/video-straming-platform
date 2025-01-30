import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import mongoose from "mongoose";
import {uploadMp4ToS3} from "../utils/AWS.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js"
import { exec } from "child_process";


const getVideoDuration = async (filePath) => {
    return new Promise((resolve, reject) => {
        const command = `ffprobe -i "${filePath}" -show_entries format=duration -v quiet -of csv="p=0"`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error getting duration: ${error.message}`);
            } else {
                resolve(parseFloat(stdout.trim())); // Duration in seconds
            }
        });
    });
};

const uploadVideo = asyncHandler(async(req,res)=>{
    const {title,description}=req.body;

    const owner = req.user;

    if(!owner){
        throw new ApiError(404,"Sign in or register to upload video!")
    }

    if(!title){
        throw new ApiError(400, "Title is required!");
    }


    let videoFileLocalPath=null;
    if(req.files && Array.isArray(req.files.videoFile) && req.files.videoFile.length>0){
        videoFileLocalPath=req.files.videoFile[0].path;
    }
    let duration = await getVideoDuration(videoFileLocalPath);
    duration = Math.round(duration); // Round off the duration to the nearest whole number
    console.log(duration);

    let thumbnailLocalPath=null;
    if(req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length>0){
        thumbnailLocalPath=req.files.thumbnail[0].path;
    }

    if(!videoFileLocalPath || !thumbnailLocalPath || !duration){
        throw new ApiError(400, "Missing required fields!");
    }

    await uploadMp4ToS3(videoFileLocalPath);
    const thumbnail=await uploadOnCloudinary(thumbnailLocalPath);

    

    const userId=owner._id.toString();
    const fileNameOnS3 = videoFileLocalPath.split("\\").pop().split(".")[0];
    const response={
        urlTo144p: `https://s3.us-east-1.amazonaws.com/${process.env.UPLOAD_VIDEO_BUCKET_NAME}/transcoded/${userId}/${fileNameOnS3}/${fileNameOnS3}-144p/index.m3u8`,
        urlTo480p: `https://s3.us-east-1.amazonaws.com/${process.env.UPLOAD_VIDEO_BUCKET_NAME}/transcoded/${userId}/${fileNameOnS3}/${fileNameOnS3}-480p/index.m3u8`,
        urlTo720p: `https://s3.us-east-1.amazonaws.com/${process.env.UPLOAD_VIDEO_BUCKET_NAME}/transcoded/${userId}/${fileNameOnS3}/${fileNameOnS3}-720p/index.m3u8`,
        urlTo1080p: `https://s3.us-east-1.amazonaws.com/${process.env.UPLOAD_VIDEO_BUCKET_NAME}transcoded//${userId}/${fileNameOnS3}/${fileNameOnS3}-1080p/index.m3u8`,
    }

    const video=await Video.create({
        title,
        thumbnail:thumbnail.secure_url,
        description,
        owner,
        duration,
        videoFile: response
    });

    return res.status(201).json(
        new ApiResponse(200, video, "Video uploded Successfully!")
    );
});


export {
    uploadVideo
}

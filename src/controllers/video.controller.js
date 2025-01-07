import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import mongoose from "mongoose";
import {uploadMp4ToS3} from "../utils/AWS.js"

const uploadVideo = asyncHandler(async(req,res,next)=>{
    const {title,description}=req.body;

    const owner = req.user;

    if(!owner){
        throw new ApiError(404,"Sign in or register to upload video!")
    }

    // if(!title){
    //     throw new ApiError(400, "Title is required!");
    // }


    let videoFileLocalPath=null;
    if(req.files && Array.isArray(req.files.videoFile) && req.files.videoFile.length>0){
        videoFileLocalPath=req.files.videoFile[0].path;
    }

    let thumbnailLocalPath=null;
    if(req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length>0){
        thumbnailLocalPath=req.files.thumbnail[0].path;
    }

    if(!videoFileLocalPath){
        throw new ApiError(400, "Video file is required!");
    }
    // if(!thumbnailLocalPath){
    //     throw new ApiError(400, "Thumbnail file is required!");
    // }

    const videoFileonS3=await uploadMp4ToS3(videoFileLocalPath);

    return res.status(201).json(
        new ApiResponse(200, videoFileonS3, "videofileons3")
    );
    


});

export {
    uploadVideo
}

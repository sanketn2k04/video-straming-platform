import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {Video} from "../models/video.model.js"
import mongoose from "mongoose"


export const increaseViewsCount=asyncHandler(async(req,res,next)=>{
    try {
        let { videoId } = req.params;
    
        if (!videoId){
            throw new ApiError(400,"Video Id is required!")
        }

        console.log(videoId);

        videoId = new mongoose.Types.ObjectId(videoId);

        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            throw new ApiError(400, "Invalid Video ID!");
        }
    
        await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
    
        next();
    } catch (error) {
        throw new ApiError(500,error?.message || "Error in increasing views count!")
    }

});
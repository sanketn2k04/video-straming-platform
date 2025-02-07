import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {Video} from "../models/video.model.js"


export const increaseViewsCount=asyncHandler(async(req,res,next)=>{
    try {
        const { videoId } = req.params;
    
        if (!videoId){
            throw new ApiError(400,"Video Id is required!")
        }
    
        await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
    
        next();
    } catch (error) {
        throw new ApiError(500,error?.message || "Error in increasing views count!")
    }

});
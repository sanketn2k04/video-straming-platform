import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const subscribe = asyncHandler(async (req, res) => {
    const subscriber= req.user._id;
    const { channel } = req.body;

    // console.log("Subscriber",req.user);

    if (!mongoose.Types.ObjectId.isValid(channel)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const user = await User.findById(subscriber);
    if (!user) {
        throw new ApiError(404, "Subscriber not found");
    }

    const channelUser = await User.findById(channel);
    if (!channelUser) {
        throw new ApiError(404, "Channel not found");
    }

    const subscription = new Subscription({
        subscriber: subscriber,
        channel: channel
    });

    await subscription.save({new:true});

    return res.status(201).
        json(new ApiResponse(201, "Subscribed successfully", subscription));
});

const getAllSubscribedChannel=asyncHandler(async (req, res)=>{
    const subscriber= req.user._id;

    const user = await User.findById(subscriber);
    if (!user) {
        throw new ApiError(404, "Subscriber not found");
    }

    const getAllChannels=await Subscription.find({ subscriber: subscriber })


    return res.status(200).
        json(new ApiResponse(200, "All channels", getAllChannels));
    
});

export {
    subscribe,
    getAllSubscribedChannel
}
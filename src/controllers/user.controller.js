import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
// import fs from fs;


const genrateAccessAndRefereshToken = async(userId)=>{
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found!");
        }  
        const accessToken=await user.generateAccessToken();
        const refreshToken=await user.generateRefreshToken();
        // console.log(refreshToken)

        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false});

        return {accessToken,refreshToken};
    } catch (error) {
        throw new ApiError(500,"Something went wrong while genrating Referesh and Access Token!")
    }
}

const registerUser = asyncHandler(async (req, res,next) => {
    //Taking user data

    // validations
    //check if user already exists
    // check for images and avatar
    //upload them to cloudinary,avtar

    //create user object
    //Writing user in DB
    //Remove password and RT from field
    //check from user creation
    //return res
  

    const {username,email,password} = req.body;
    console.log("email: " ,req.body);

    if([username,email,password].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"All fields are required!")
    }

    const existedUser = await User.findOne({
        $or: [{ email: email }, { username: username }]
    });

    // console.log(existedUser);
    if(existedUser){
        
        throw new ApiError(409,"User already exists with similar username or email!");
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path || null;
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path || null;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath=req.files.coverImage[0].path;
    }

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required!")
    }

    const avatar=await uploadOnCloudinary(avatarLocalPath);
    const coverImage=await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400,"Avatar is required!")
    }

    const user=await User.create({
        username,
        email,
        password,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        username:username.toLowerCase()
    });



    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registring user!");
    }


    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    );

});

const loginUser = asyncHandler(async (req,res,next) => {
    //get username or email ,password from user
    //fetch user in  database
    //if user DNE return error
    //if exist check password
    //AT & RT return to user in cookies
    //send respose

    const {username,email,password} = req.body;
    // console.log(req.body);
    if(!(username || password)){
        throw new ApiError(400,"username or password is required!");
    }

    const user=await User.findOne({
        $or:[{username},{email}]
    });

    if(!user){
        throw new ApiError(404,"User doesn't Exist!");
    }

    const isPasswordValid=await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credential!");
    }

    const {accessToken,refreshToken}=await genrateAccessAndRefereshToken(user._id);

    const loggedInUser=await User.findById(user._id).select("-password -refreshToken");

    const options={
        httpOnly:true,
        secure:true
    }

    return res.
        status(200).
        cookie("accessToken",accessToken,options).
        cookie("refreshToken",refreshToken,options).
        json(
            new ApiResponse(
                200,
                {
                    user:loggedInUser,accessToken,refreshToken
                },
                "User logged In Successfully"
            )
        )


});

const logoutUser= asyncHandler(async (req,res,next)=>{
    await User.findByIdAndUpdate(req.user._id,
        {
            $set:{
                refreshToken:1
            }
        },
        {
            new:true
        }
    );

    const options={
        httpOnly:true,
        secure:true
    }

    return res
            .status(200)
            .clearCookie("accessToken",options)
            .clearCookie("refreshToken",options)
            .json(
                new ApiResponse(200,{},"User logged out successfully!")
            )

});

const refreshAccessToken = asyncHandler(async(req,res,next)=>{
    const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(401,"Invalid refresh Token!");
    }

    const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id);

    if(!user){
        throw new ApiError(401,"Invalid refresh Token!");
    }

    if(user.refreshToken!==incomingRefreshToken){
        throw new ApiError(401,"Refresh token expired or Invalid!");
    }

    const {accessToken,refreshToken}=await genrateAccessAndRefereshToken(user._id);

    const options={
        httpOnly:true,
        secure:true
    }

    return res.
        status(200).
        cookie("accessToken",accessToken,options).
        cookie("refreshToken",refreshToken,options).
        json(
            new ApiResponse(
                200,
                {
                    accessToken,refreshToken
                },
                "Access token refreshed!"
            )
        )
    


});

const changeCurrentPassword = asyncHandler(async(req,res,next)=>{
    const {oldPassword,newPassword} = req.body;
    const user = await User.findById(req.user?._id);

    // if(!user){
    //     throw new ApiError(404,"unAuthorized request");
    // }

    const isPasswordCorrect=await user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect){
        throw new ApiError(400,"Incorrect old password!");
    }

    user.password=newPassword;
    await user.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Password changed succesfully!"))

});

const getCurrentUser = asyncHandler(async(req,res,next)=>{
    return res
    .status(200)
    .json(new ApiResponse(200,req.user,"current user fetched succesfully!"))
});

const updateAccountDetails = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    // const user = await User.findById(req.user?.id);

    // if (!user) {
    //     throw new ApiError(404, "User not found!");
    // }

    if (!email) {  
        throw new ApiError(409, "Email is required!");
    }

    // await user.save({ validateBeforeSave: false });

    const updatedUser = await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            email
        }
    },{new:true}).select("-password");

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "Account details updated successfully!")
    );
});

const updateUserAvatar = asyncHandler(async(req,res,next)=>{
    const avatarLocalPath=req.file.path;
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is missing!")
    }
    const avatar=await uploadOnCloudinary(avatarLocalPath);

    if(!avatar.url){
        throw new ApiError(500,"Error while uploading avatar!")
    }


    const updatedUser = await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            avatar:avatar.url
        }
    },{new:true}).select("-password");

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "Account details updated successfully!")
    );
});

const updateUserCoverImage = asyncHandler(async(req,res,next)=>{
    const coverImageLocalPath=req.file.path;
    if(!coverImageLocalPath){
        throw new ApiError(400,"Cover image is missing!")
    }
    const coverImage=await uploadOnCloudinary(coverImageLocalPath);

    //TODO: delete image on cloudinary
    if(!coverImage.url){
        throw new ApiError(500,"Error while uploading Cover image!")
    }


    const updatedUser = await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            coverImage:coverImage.url
        }
    },{new:true}).select("-password");

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "Account details updated successfully!")
    );
});

//TODO:revise below two methods
const getUserChannelProfile = asyncHandler(async(req,res,next)=>{
    const {username}=req.params;

    if(!username?.trim()){
        throw new ApiError(400,"Username is missing!");
    }

    const channel = await User.aggregate([
        {
            $match:{
            username:username?.toLowerCase()
            }
        },
        {
            $lookup:{
            from: "subscriptions",
            localField: "_id",
            foreignField: "channel",
            as: "subscribers"
            }
        },
        {
            $lookup:{
            from: "subscriptions",
            localField: "_id",
            foreignField: "subscriber",
            as: "subscribedTo"
            }    
        },
        {
            $addFields:{
                subscribersCount:{
                    $size:"$subscribers"
                },
                channelsSubscribedToCount:{
                    $size:"$subscribedTo"
                },
                isSubscribed:{
                    $cond:{
                        if:{$in:[req.user?._id,"$subscribers.subscriber"]},
                        then:true,
                        else:false
                    }
                }
            }
        },
        {
            $project:{
                username:1,
                avatar:1,
                coverImage:1,
                subscribersCount:1,
                channelsSubscribedToCount:1,
                isSubscribed:1
            }
        }
        
    ]);
    //TODO:console.log(channel)
    console.log(channel)

    if(!channel?.length){
        throw new ApiError(400,"Channel does not exists!");
    }

    return res.status(200).json(
        new ApiResponse(200, channel[0], "User Profile fetched succesfully!")
    );
    
});

const getWatchHistory = asyncHandler(async(req,res,next)=>{
    const user=await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:[
                                {
                                    $project:{
                                        username:1,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                        //TODO:try moving the upper subpipeline here
                    },
                    {
                        $addFields:{
                            owner:{
                                $first:"$owner"
                            }
                        }
                    }
                ]
            }
        } 

    ])

    return res.status(200).json(
        new ApiResponse(200, user[0].watchHistory, "Watch History fetched succesfully!")
    );



})

export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
}; 
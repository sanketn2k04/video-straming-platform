import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
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
                refreshToken:undefind
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

export { 
    registerUser,
    loginUser,
    logoutUser
}; 
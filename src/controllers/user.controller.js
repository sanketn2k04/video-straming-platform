import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"


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
    // console.log("email: " ,email);

    if([username,email,password].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"All fields are required!")
    }

    const existedUser = await User.findOne({
        $or: [{ email: email }, { username: username }]
    });

    console.log(existedUser);
    if(existedUser){
        throw new ApiError(409,"User already exists with similar username or email!");
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path || null;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path || null;

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

export { registerUser };
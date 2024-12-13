import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"

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

    const avatar = req.files?.avatar[0]?.path;

    // console.log(avatar);



    
    





    res.status(200).json({
        message: email
    });

});

export { registerUser };
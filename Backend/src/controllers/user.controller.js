import {User} from '../models/user.model.js'
import  cloudinary from "cloudinary"
import fs from "fs/promises"
import bcrypt from 'bcrypt';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import sendEmail from '../utils/sendEmail.js';




const cookieOptions = {
    httpOnly: true,
    maxAge: process.env.JWT_EXPIRES,
    secure: true
}


const registerUser = asyncHandler(async (req, res) => {
    
    const {fullName, email, password} = req.body;

    if (!fullName || !email || !password) {
        throw new ApiError(400, "all fields are required");
    }

    const existedUser = await User.findOne({email})
    if(existedUser) {
        throw new ApiError(400, "email already exists");
    }

    
    // todo file uploading in the cloudinary


    // const avatarLocalPath = req.files?.avatar.path;

    // const avatar = await uploadOnCloudinary(avatarLocalPath);

    // if (!avatar) {
    //     throw new ApiError(500, "avatar not uploaded by server");
    // }

    const user = await User.create({
        fullName,
        email,
        password,
        avatar: {
            public_id: null,                                
            secure_url: ""
        }

    })

    if (!user) {
        throw new ApiError(500, "user not created by server");
    }
    console.log("user email",user.email);

    console.log(fullName, email, password);
    //  todo upload the avatar to cloudinary

    // Run only if user sends a file
    if (req.file) {
        console.log(req.file);
        try {

            const result = await cloudinary.v2.uploader.upload(req.file.path, {

                folder: 'uploads',  // Save files in a folder named lms
                width: 250,
                height: 250,
                gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
                crop: 'fill',
            });

            

            if(result) {

                // Set the public_id and secure_url in DB
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;

        

                // After successful upload remove the file from local storage
                fs.rm(`uploads/${req.file.filename}`);
            }

            

        }

        catch (error) {
        
            new ApiError(error)
            console.log("error in uploading avatar", error);
        
        }
    }

    
    await user.save();

    user.password = undefined;

    const token = user.generatetoken();

    return res.cookie('token', token, cookieOptions)

    .status(200)
    .json(
        new ApiResponse(200, "user created successfully", user)
    )
})


const loginUser = async (req, res) => {

    try {
        const {email, password} = req.body;
    
        if (!email || !password) {
            throw new ApiError(400, "all fields are required");
        }
    
        const user = await User.findOne({email}).select('+password');
        if (!user) {
            throw new ApiError(401, "user not found");
        }
    
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            throw new ApiError(401, "invalid password");
        }
    
        const token = user.generatetoken();
    
        user.password = undefined;
    
        return res.cookie('token', token, cookieOptions)
            .status(200)
            .json(
                new ApiResponse(200, "user logged in successfully", user)
            )
    
    } 
    catch (error) {
        console.log("error in login method", error);
        throw new ApiError(500, "server error");
    }

}
const logoutUser = async (req, res) => {

    try {
        res.cookie('token', null, cookieOptions );
        return res.status(200).json(    
            new ApiResponse(200, "user logged out successfully")
        )
    } catch (error) {
        console.log("error in logout method", error);
    }
}


const getUser = async (req, res) => {

    try {
        const userId = req.user.id;
    
        const user = await User.findById({_id: userId});
        return res.status(200).json(
            new ApiResponse(200, "user details fetched successfully", user)
        )
    } 
    catch (error) {
        console.log("error in getUser method", error);
        throw new ApiError(500, "fail to fetch user detail server error");
    
    }

}


const forgotPassword = asyncHandler(async (req, res) => {

    const {email} = req.body;

    if (!email) {
        throw new ApiError(400, "email must be required");
    }

    const user = await User.findOne({email});

    if (!user) {
        throw new ApiError(404, "user not found");
    }

    const resetToken = user.generatePasswordResetToken();

    await user.save();

    const resetUrl = `http://localhost:${process.env.PORT}/reset-password?token=${resetToken}`;


    try {
        const subject = "Password reset";

        const message = `Hi this from LMS, please click on the a link below to reset your password ${resetUrl} If link is not working please copy and paste the link in your browser <a>${resetUrl}</a>`;
    
        await sendEmail(email, subject, message);



        res.status(200).json(
            new ApiResponse(200, `password reset email ${email} sent successfully`)
        )

    } 
    catch (error) {
        user.forgotPasswordExpires = null;
        user.forgotPasswordToken = null;
        await user.save();
        console.log(error);
        throw new ApiError(500, "server error", error);
        
    }
})


const resetPassword = asyncHandler(async (req, res) => {

    const {token, password} = req.body;

    if (!token || !password) {
        throw new ApiError(400, "token and password must be required");
    }

    

    return res.status(200).json(
        new ApiResponse(200, "password reset successfully")
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    forgotPassword, 
    resetPassword
}
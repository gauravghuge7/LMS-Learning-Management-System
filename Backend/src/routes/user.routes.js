import { Router } from "express";

const userRouter = Router();



import { 
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    forgotPassword,
    resetPassword,
    changePassword,
    updateUser


} from "../controllers/user.controller.js";

import { isLoggedIn } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

userRouter.post('/register', upload.single("avatar"), registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/logout', logoutUser);
userRouter.get('/getUser', isLoggedIn, getUser);
userRouter.post('/forgotPassword', forgotPassword);
userRouter.post('/resetPassword', resetPassword);

userRouter.put('/changePassword', isLoggedIn, changePassword)
userRouter.post('/updateUser', isLoggedIn, updateUser);

export {
    userRouter
}


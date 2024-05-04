import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const isLoggedIn = asyncHandler(async(req, res, next) => {

    const {token} = req.cookies.token;
    if (!token) {
        throw new ApiError(401, "token is not read by server or token is empty");
    }
    
    const userDetails = await WT.verify(token, process.env.JWT_SECRET);
    req.user = userDetails;




    next();
})

export {
    isLoggedIn
}
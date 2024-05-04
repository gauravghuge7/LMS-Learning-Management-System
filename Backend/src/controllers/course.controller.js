import { Course } from "../models/course.model"
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler"


const getAllCourses =  asyncHandler( async(req, res) => {

    const courses = await Course.find({}).select('-lectures');

    return res.status(200)
    .json(
        new ApiResponse(200, " all cources fetched successfuly", courses)
    )

})


const getLectureByCourseId = (() => {

})

export {
    getAllCourses,
    getLectureByCourseId
}
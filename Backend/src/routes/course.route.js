import { Router  } from "express";
import { getAllCourses, getLectureByCourseId } from "../controllers/course.controller";



const courseRouter = Router();


courseRouter.get('/', getAllCourses);

courseRouter.get('/:id', getLectureByCourseId);

export default courseRouter;
import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { CourseValidations } from "./course.validation";
import { CourseControllers } from "./course.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";

const route = Router();

route.post('/create-course', auth(USER_ROLE.admin), validateRequest(CourseValidations.createCourseValidationSchema), CourseControllers.createCourse);
route.get('/', auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student), CourseControllers.getAllCorses);
route.get('/:id', auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student), CourseControllers.getSingleCourse);
route.put('/:courseId/assign-faculties', auth(USER_ROLE.admin), validateRequest(CourseValidations.facultiesWithCourseValidationSchema), CourseControllers.assignFacultiesWithCourse);
route.delete('/:courseId/remove-faculties', auth(USER_ROLE.admin), validateRequest(CourseValidations.facultiesWithCourseValidationSchema), CourseControllers.removeFacultiesFromCourse);
route.patch('/:id', auth(USER_ROLE.admin), validateRequest(CourseValidations.updateCourseValidationSchema), CourseControllers.updateCourse);
route.delete('/:id', auth(USER_ROLE.admin), CourseControllers.deleteCourse)



export const CourseRoutes = route
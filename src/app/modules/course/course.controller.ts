import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CourseServices } from "./course.service";


const createCourse = catchAsync(async (req, res) => {
    const result = await CourseServices.createCourseIntoDB(req.body);
    sendResponse(res, {
        message: "Course Created Successfully!",
        data: result
    })
})


const getAllCorses = catchAsync(async (req, res) => {
    const result = await CourseServices.getAllCoursesFromDB(req.query);
    sendResponse(res, {
        message: "Get All Course Successfully!",
        data: result
    })
})


const getSingleCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.getSingleCourseFromDB(id);
    sendResponse(res, {
        message: "Get Course Successfully!",
        data: result
    })
})


const deleteCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.deleteCourseFromDB(id);
    sendResponse(res, {
        message: "Course Deleted Successfully!",
        data: result
    })
})

const updateCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.updateCourseFromDB(id, req.body);
    sendResponse(res, {
        message: "Course Updated Successfully!",
        data: result
    })
})


const assignFacultiesWithCourse = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const { faculties } = req.body;
    const result = await CourseServices.assignFacultiesWithCourseIntoDB(courseId, faculties);
    sendResponse(res, {
        message: "Faculty Assign Successfully!",
        data: result
    })
})

const removeFacultiesFromCourse = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const { faculties } = req.body;
    const result = await CourseServices.removeFacultiesFromCourseIntoDB(courseId, faculties);
    sendResponse(res, {
        message: "Faculty Remove Successfully!",
        data: result
    })
})



export const CourseControllers = {
    createCourse,
    getAllCorses,
    getSingleCourse,
    deleteCourse,
    updateCourse,
    assignFacultiesWithCourse,
    removeFacultiesFromCourse
}

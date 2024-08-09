import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { OfferedCourseServices } from "./OfferedCourse.service";



const createOfferedCourse = catchAsync(async (req, res) => {
    const result = await OfferedCourseServices.createOfferedCourseIntoDB(req.body);

    sendResponse(res, {
        data: result,
        message: 'Offered Course Created Successfully!'
    })
})

const getSingleOfferedCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await OfferedCourseServices.getSingleOfferedCourseFromDB(id);

    sendResponse(res, {
        message: 'Offered Course is retrieved successFully',
        data: result,
    })
})

const getAllOfferedCourse = catchAsync(async (req, res) => {
    const query = req.query
    const result = await OfferedCourseServices.getAllOfferedCourseFromDB(query);

    sendResponse(res, {
        message: 'All Offered Course are retrieved successfully',
        data: result,
    })
})

const updateOfferedCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await OfferedCourseServices.updateOfferedCourseIntoDB(id, req.body);

    sendResponse(res, {
        message: 'Offered Course Data is updated successfully',
        data: result,
    })
})

const deleteOfferedCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await OfferedCourseServices.deleteOfferedCourseFromDB(id);

    sendResponse(res, {
        message: 'Offered Course data is deleted successfully',
        data: result,
    });
});

export const OfferedCourseControllers = {
    createOfferedCourse,
    getAllOfferedCourse,
    getSingleOfferedCourse,
    updateOfferedCourse,
    deleteOfferedCourse,
};
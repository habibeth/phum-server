import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { SemesterRegistrationServices } from "./semesterRegistration.service";


const createSemesterRegistration = catchAsync(async (req, res) => {
    const result = await SemesterRegistrationServices.createSemesterRegistrationIntoDB(req.body);

    sendResponse(res, {
        data: result,
        message: 'Create Semester Registration Successfully!'
    })
})

const getSingleSemesterRegistration = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await SemesterRegistrationServices.getSingleSemesterRegistrationFromDB(id);

    sendResponse(res, {
        message: 'Semester is retrieved successFully',
        data: result,
    })
})

const getAllSemesterRegistration = catchAsync(async (req, res) => {
    const query = req.query
    const result = await SemesterRegistrationServices.getAllSemesterRegistrationFromDB(query);

    sendResponse(res, {
        message: 'All Semester are retrieved successfully',
        data: result,
    })
})

const updateSemesterRegistration = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await SemesterRegistrationServices.updateSemesterRegistrationIntoDB(id, req.body);

    sendResponse(res, {
        message: 'Semester Data is updated successfully',
        data: result,
    })
})

const deleteSemesterRegistration = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await SemesterRegistrationServices.deleteSemesterRegistrationFromDB(id);

    sendResponse(res, {
        message: 'Faculty is deleted successfully',
        data: result,
    });
});

export const SemesterRegistrationControllers = {
    createSemesterRegistration,
    getAllSemesterRegistration,
    getSingleSemesterRegistration,
    updateSemesterRegistration,
    deleteSemesterRegistration,
};
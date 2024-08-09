import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AcademicDepartmentServices } from "./academicDepartment.service";


const createAcademicDepartment = catchAsync(async (req, res) => {
    const result = await AcademicDepartmentServices.createDepartmentIntoDB(req.body);
    sendResponse(res, {
        message: "Academic Department Created Successfully!",
        data: result
    })
})


const getAllAcademicDepartment = catchAsync(async (req, res) => {
    const result = await AcademicDepartmentServices.getAllAcademicDepartment();
    sendResponse(res, {
        message: "Fetch All Department Data Retrieve Successfully!",
        data: result
    })
})


const getSingleAcademicDepartment = catchAsync(async (req, res) => {
    const { departmentId } = req.params;
    const result = await AcademicDepartmentServices.getSingleAcademicDepartment(departmentId);
    sendResponse(res, {
        message: "Fetch Single Department Data Retrieve Successfully!!",
        data: result
    })
})


const updateAcademicDepartment = catchAsync(async (req, res) => {
    const { departmentId } = req.params;
    const result = await AcademicDepartmentServices.updateSingleAcademicDepartment(departmentId, req.body);
    sendResponse(res, {
        message: "Academic Department Updated Successfully!",
        data: result
    })
})


export const AcademicDepartmentController = {
    createAcademicDepartment,
    getAllAcademicDepartment,
    getSingleAcademicDepartment,
    updateAcademicDepartment
}
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AcademicSemesterServices } from "./academicSemester.service";



const createAcademicSemester = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(req.body)
    sendResponse(res, {
        message: "Create Semester Successfully!",
        data: result
    })
})

const getAllAcademicSemester = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.getAllAcademicSemesterIntoDB();
    sendResponse(res, {
        message: "Get All Academic Semester Successfully!",
        data: result
    })
})

const getAcademicSemester = catchAsync(async (req, res) => {
    const { semesterId } = req.params;
    const result = await AcademicSemesterServices.getAcademicSemesterIntoDB(semesterId);

    sendResponse(res, {
        message: "Student Get Successfully",
        data: result
    })
})


const updateAcademicSemester = catchAsync(async (req, res) => {
    const { semesterId } = req.params;
    const updateDoc = req.body;
    const result = await AcademicSemesterServices.updateAcademicSemesterIntoDB(semesterId, updateDoc);

    sendResponse(res, {
        message: "Student Updated Successfully",
        data: result
    })
})

export const AcademicSemesterController = {
    createAcademicSemester,
    getAllAcademicSemester,
    getAcademicSemester,
    updateAcademicSemester
}
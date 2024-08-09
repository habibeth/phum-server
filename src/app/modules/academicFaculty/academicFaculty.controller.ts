import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AcademicFacultyServices } from "./academicFaculty.service";


const createAcademicFaculty = catchAsync(async (req, res) => {
    const faculty = req.body;
    const result = await AcademicFacultyServices.createAcademicFacultyIntoDB(faculty);
    sendResponse(res, {
        message: "Created Academic Faculty Successfully!",
        data: result
    })
})


const getAllAcademicFaculties = catchAsync(async (req, res) => {
    const result = await AcademicFacultyServices.getAllAcademicFacultiesFromDB();
    sendResponse(res, {
        message: "Get All Academic Faculties Successfully!",
        data: result
    })
})


const getSingleAcademicFaculty = catchAsync(async (req, res) => {
    const { facultyId } = req.params;
    const result = await AcademicFacultyServices.getSingleAcademicFacultyFromDB(facultyId);
    sendResponse(res, {
        message: "Get Academic Faculty Successfully!",
        data: result
    })
})


const updateSingleAcademicFaculty = catchAsync(async (req, res) => {
    const { facultyId } = req.params;
    const faculty = req.body;
    const result = await AcademicFacultyServices.updateSingleAcademicFacultyIntoDB(facultyId, faculty);
    sendResponse(res, {
        message: "Update Academic Faculty Successfully!",
        data: result
    })
})




export const AcademicFacultyController = {
    createAcademicFaculty,
    getAllAcademicFaculties,
    getSingleAcademicFaculty,
    updateSingleAcademicFaculty
}
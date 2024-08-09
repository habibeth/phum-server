import { StudentServices } from "./student.service";
import { sendResponse } from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";



const getAllStudents = catchAsync(async (req, res) => {
    const query = req.query
    const result = await StudentServices.getAllStudentFromDB(query);

    sendResponse(res, {
        message: 'Student are retrieved Successfully',
        data: result
    })
})

const getSingleStudent = catchAsync(async (req, res) => {
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentId);

    sendResponse(res, {
        message: "Student are retrieved Successfully",
        data: result
    })
})

const updatedAStudent = catchAsync(async (req, res) => {
    const { studentId } = req.params;
    const { student } = req.body;
    const result = await StudentServices.updateAStudentFromDB(studentId, student);

    sendResponse(res, {
        message: "Student Data Updated Successfully",
        data: result
    })
})


const deleteStudent = catchAsync(async (req, res) => {
    const { studentId } = req.params;
    const result = await StudentServices.deleteStudentFromDB(studentId);

    sendResponse(res, {
        message: "Student Data Deleted Successfully",
        data: result
    })
})



export const StudentControllers = {
    getAllStudents,
    getSingleStudent,
    deleteStudent,
    updatedAStudent
}
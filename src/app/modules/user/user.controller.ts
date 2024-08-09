import { RequestHandler } from "express";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";

const createStudent: RequestHandler = catchAsync(async (req, res) => {
    // console.log(req.file)
    const { password, student: studentData } = req.body;

    const result = await UserServices.createStudentIntoDB(req.file, password, studentData);
    sendResponse(res, {
        message: 'Student created Successfully',
        data: result
    })
})

const createFaculty = catchAsync(async (req, res) => {
    const { password, faculty: facultyData } = req.body;

    const result = await UserServices.createFacultyIntoDB(req.file, password, facultyData);

    sendResponse(res, {
        message: 'Faculty is created successfully',
        data: result,
    });
});

const createAdmin = catchAsync(async (req, res) => {
    const { password, admin: adminData } = req.body;

    const result = await UserServices.createAdminIntoDB(req.file, password, adminData);

    sendResponse(res, {
        message: 'Admin is created successfully',
        data: result,
    });
});
const getMe = catchAsync(async (req, res) => {
    // const token = req.headers.authorization;
    // if (!token) {
    //     throw new AppError(httpStatus.NOT_FOUND, "You are not Authorize")
    // }
    const { userId, role } = req.user
    const result = await UserServices.getMeIntoDB(userId, role);
    sendResponse(res, {
        message: 'User is Retrieved Successfully!',
        data: result,
    });
});

const userStatusUpdate = catchAsync(async (req, res) => {
    const id = req.params.id;
    const result = await UserServices.userStatusUpdateIntoDB(id, req.body);


    sendResponse(res, {
        message: 'User Status Updated Successfully!',
        data: result,
    });
})


export const UserControllers = {
    createStudent,
    createFaculty,
    createAdmin,
    getMe,
    userStatusUpdate
}
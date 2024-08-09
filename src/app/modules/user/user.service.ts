import httpStatus from "http-status";
import config from "../../config";
import { AppError } from "../../error/AppError";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface"
import { User } from "./user.model"
import { generateAdminId, generateFacultyId, generateStudentId } from "./user.utils";
import mongoose from "mongoose";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { Admin } from "../admin/admin.model";
import { TAdmin } from "../admin/admin.interface";
import { TFaculty } from "../faculty/faculty.interface";
import { Faculty } from "../faculty/faculty.model";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";



const createStudentIntoDB = async (file: any, password: string, payload: TStudent) => {
    // console.log(file)
    //create user object
    const userData: Partial<TUser> = {}
    //if password not given
    userData.password = password || config.default_password as string

    //student role
    userData.role = 'student';
    userData.email = payload.email;




    const admissionSemester = await AcademicSemester.findById(payload.admissionSemester);
    if (!admissionSemester) {
        throw new AppError(httpStatus.NOT_FOUND, 'Admission Semester not Found')
    }

    // find department
    const academicDepartment = await AcademicDepartment.findById(
        payload.academicDepartment,
    );

    if (!academicDepartment) {
        throw new AppError(400, 'Academic department not found');
    }
    payload.academicFaculty = academicDepartment.academicFaculty;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        //set automatically generated id
        userData.id = await generateStudentId(admissionSemester);


        if (file) {
            const imageName = `${userData?.id}${payload?.name.firstName}`
            const path = file?.path
            //send Image Cloudinnary
            const { secure_url } = await sendImageToCloudinary(imageName, path);
            payload.profileImage = secure_url as string
        }



        //create a user
        //session 1 transaction 1
        const newUser = await User.create([userData], { session });

        //create a student
        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, "Failed to Create User!")
        }
        //set id , _id as user  
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;  //reference id


        //transaction 2
        const newStudent = await Student.create([payload], { session });

        if (!newStudent.length) {
            throw new AppError(httpStatus.BAD_REQUEST, "Failed to Create Student!")
        }

        await session.commitTransaction();
        await session.endSession()

        return newStudent;

    } catch (err) {
        await session.abortTransaction();
        await session.endSession()
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to Create These Data!")
    }
}

const createFacultyIntoDB = async (file: any, password: string, payload: TFaculty) => {
    // create a user object
    const userData: Partial<TUser> = {};

    //if password is not given , use deafult password
    userData.password = password || (config.default_password as string);

    //set student role
    userData.role = 'faculty';
    userData.email = payload.email;

    // find academic department info
    const academicDepartment = await AcademicDepartment.findById(
        payload.academicDepartment,
    );

    if (!academicDepartment) {
        throw new AppError(400, 'Academic department not found');
    }

    payload.academicFaculty = academicDepartment.academicFaculty

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        //set  generated id
        userData.id = await generateFacultyId();


        if (file) {
            const imageName = `${userData?.id}${payload?.name.firstName}`
            const path = file?.path
            //send Image Cloudinnary
            const { secure_url } = await sendImageToCloudinary(imageName, path);
            payload.profileImage = secure_url as string
        }

        // create a user (transaction-1)
        const newUser = await User.create([userData], { session }); // array

        //create a faculty
        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
        }
        // set id , _id as user
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;  //reference id

        // create a faculty (transaction-2)

        const newFaculty = await Faculty.create([payload], { session });

        if (!newFaculty.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
        }

        await session.commitTransaction();
        await session.endSession();

        return newFaculty;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }
};

const createAdminIntoDB = async (file: any, password: string, payload: TAdmin) => {
    // create a user object
    const userData: Partial<TUser> = {};

    //if password is not given , use deafult password
    userData.password = password || (config.default_password as string);

    //set student role
    userData.role = 'admin';
    userData.email = payload.email;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        //set  generated id
        userData.id = await generateAdminId();


        if (file) {
            const imageName = `${userData?.id}${payload?.name.firstName}`
            const path = file?.path
            //send Image Cloudinnary
            const { secure_url } = await sendImageToCloudinary(imageName, path);
            payload.profileImage = secure_url as string
        }

        // create a user (transaction-1)
        const newUser = await User.create([userData], { session });

        //create a admin
        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
        }
        // set id , _id as user
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;  //reference id

        // create a admin (transaction-2)
        const newAdmin = await Admin.create([payload], { session });

        if (!newAdmin.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
        }

        await session.commitTransaction();
        await session.endSession();

        return newAdmin;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }
};

const getMeIntoDB = async (userId: string, role: string) => {
    // const decoded = verifyToken(token, config.jwt_access_secret as string)
    // // console.log({ decoded })
    // const { userId, role } = decoded;
    let result = null
    if (role === 'student') {
        result = await Student.findOne({ id: userId }).populate('user')
    }
    if (role === 'faculty') {
        result = await Faculty.findOne({ id: userId }).populate('user')
    }
    if (role === 'admin') {
        result = await Admin.findOne({ id: userId }).populate('user')
    }
    return result;
}
const userStatusUpdateIntoDB = async (id: string, payload: { status: string }) => {
    // console.log(payload)
    const result = await User.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    return result;
}


export const UserServices = {
    createStudentIntoDB,
    createFacultyIntoDB,
    createAdminIntoDB,
    getMeIntoDB,
    userStatusUpdateIntoDB
}
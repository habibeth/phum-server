import httpStatus from "http-status";
import { AppError } from "../../error/AppError";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { SemesterRegistration } from "./semesterRegistration.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { RegistrationStatus } from "./semesterRegistration.constant";




const createSemesterRegistrationIntoDB = async (payload: TSemesterRegistration) => {
    //check if the semester is exists
    const academicSemester = payload?.academicSemester;

    const isThereAnyUpcomingOrOngoingSemester = await SemesterRegistration.findOne({
        $or: [{ status: RegistrationStatus.UPCOMING }, { status: RegistrationStatus.ONGOING }]
    })
    if (isThereAnyUpcomingOrOngoingSemester) {
        throw new AppError(httpStatus.NOT_FOUND, `There is Already a ${isThereAnyUpcomingOrOngoingSemester.status} semester`)
    }


    const isAcademicSemesterExists = await AcademicSemester.findById(academicSemester);

    if (!isAcademicSemesterExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'This Semester Can not Found!')
    }

    const isSemesterRegistrationExists = await SemesterRegistration.findOne({ academicSemester })
    if (isSemesterRegistrationExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'This Semester already Registered!')
    }

    const result = await SemesterRegistration.create(payload);
    return result;
};
const getAllSemesterRegistrationFromDB = async (query: Record<string, unknown>) => {
    const semesterRegistrationQuery = new QueryBuilder(SemesterRegistration.find().populate('academicSemester'), query)
        .filter()
        .sort()
        .paginate()
        .fields()

    const result = await semesterRegistrationQuery.modelQuery
    return result;
};

const getSingleSemesterRegistrationFromDB = async (id: string) => {
    const result = await SemesterRegistration.findById(id);

    return result;
};

const updateSemesterRegistrationIntoDB = async (id: string, payload: Partial<TSemesterRegistration>) => {
    //ended check
    const isSemesterRegistrationProcessExists = await SemesterRegistration.findById(id);
    const requestedStatus = payload?.status
    const currentSemesterStatus = isSemesterRegistrationProcessExists?.status;
    if (currentSemesterStatus === RegistrationStatus.ENDED) {
        throw new AppError(httpStatus.BAD_REQUEST, 'These Semester Already Ended!')
    }

    else if (!currentSemesterStatus) {
        throw new AppError(httpStatus.BAD_REQUEST, 'These Semester is not Exists!')
    }

    if (currentSemesterStatus === RegistrationStatus.UPCOMING && requestedStatus === RegistrationStatus.ENDED) {
        throw new AppError(httpStatus.BAD_REQUEST, `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`)
    }

    if (currentSemesterStatus === RegistrationStatus.ONGOING && requestedStatus === RegistrationStatus.UPCOMING) {
        throw new AppError(httpStatus.BAD_REQUEST, `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`)
    }


    const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
    });
    return result;
};

const deleteSemesterRegistrationFromDB = async (id: string) => {

    // const result = await .findByIdAndUpdate(
    //     id,
    //     { isDeleted: true },
    //     { new: true },
    // );
    // return result;
};

export const SemesterRegistrationServices = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationFromDB,
    getSingleSemesterRegistrationFromDB,
    updateSemesterRegistrationIntoDB,
    deleteSemesterRegistrationFromDB
};
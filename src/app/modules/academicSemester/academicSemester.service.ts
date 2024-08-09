import httpStatus from "http-status";
import { AppError } from "../../error/AppError";
import { academicSemesterNameCodeMapper } from "./academicSemester.constants";
import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemester } from "./academicSemester.model";

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {

    if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new AppError(httpStatus.NOT_FOUND, 'Invalid Semester Code')
    }

    const result = await AcademicSemester.create(payload);

    return result;
}

const getAllAcademicSemesterIntoDB = async () => {
    const result = await AcademicSemester.find({})
    return result;
}


const getAcademicSemesterIntoDB = async (id: string) => {
    const result = await AcademicSemester.findOne({ _id: id })
    return result;
}


const updateAcademicSemesterIntoDB = async (id: string, payload: Partial<TAcademicSemester>) => {
    if (payload.name && payload.code && academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new AppError(httpStatus.NOT_FOUND, 'Invalid Semester Code')
    }
    const filter = { _id: id }
    const result = await AcademicSemester.findOneAndUpdate(filter, payload, { new: true });
    return result;
}


export const AcademicSemesterServices = {
    createAcademicSemesterIntoDB,
    getAllAcademicSemesterIntoDB,
    getAcademicSemesterIntoDB,
    updateAcademicSemesterIntoDB
}
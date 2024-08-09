import { TAcademicDepartment } from "./academicDepartment.interface";
import { AcademicDepartment } from "./academicDepartment.model";


const createDepartmentIntoDB = async (payload: TAcademicDepartment) => {
    const result = await AcademicDepartment.create(payload);
    return result;
}

const getAllAcademicDepartment = async () => {
    const result = await AcademicDepartment.find().populate('academicFaculty');
    return result;
}

const getSingleAcademicDepartment = async (id: string) => {
    const result = await AcademicDepartment.find({ _id: id }).populate('academicFaculty');
    return result;
}

const updateSingleAcademicDepartment = async (id: string, payload: Partial<TAcademicDepartment>) => {
    const result = await AcademicDepartment.findOneAndUpdate({ _id: id }, payload, { new: true });
    return result;
}


export const AcademicDepartmentServices = {
    createDepartmentIntoDB,
    getAllAcademicDepartment,
    getSingleAcademicDepartment,
    updateSingleAcademicDepartment
}
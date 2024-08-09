import { Schema, model } from "mongoose";
import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemesterCode, AcademicSemesterName, Months } from "./academicSemester.constants";
import { AppError } from "../../error/AppError";
import httpStatus from "http-status";



const academicSemesterSchema = new Schema<TAcademicSemester>({
    name: {
        type: String,
        required: true,
        enum: AcademicSemesterName
    },
    year: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        enum: AcademicSemesterCode
    },
    startMonth: {
        type: String,
        enum: Months,
        required: true
    },
    endMonth: {
        type: String,
        enum: Months,
        required: true
    }
}, {
    timestamps: true
})

academicSemesterSchema.pre('save', async function (next) {
    const isSemesterExists = await AcademicSemester.findOne({
        name: this.name,
        year: this.year
    })
    if (isSemesterExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Semester is Already Exists!');
    }

    next()
})


export const AcademicSemester = model<TAcademicSemester>("AcademicSemester", academicSemesterSchema)
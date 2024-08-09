import mongoose, { Schema } from "mongoose";
import { Days } from "./OfferedCourse.constant";
import { TOfferedCourse } from "./OfferedCourse.interface";

const OfferedCourseSchema = new Schema({
    semesterRegistration: {
        type: Schema.Types.ObjectId,
        ref: 'SemesterRegistration',
        required: true
    },
    academicSemester: {
        type: Schema.Types.ObjectId,
        ref: 'AcademicSemester',
        required: true
    },
    academicFaculty: {
        type: Schema.Types.ObjectId,
        ref: 'AcademicFaculty',
        required: true
    },
    academicDepartment: {
        type: Schema.Types.ObjectId,
        ref: 'AcademicDepartment',
        required: true
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    faculty: {
        type: Schema.Types.ObjectId,
        ref: 'Faculty',
        required: true
    },
    maxCapacity: {
        type: Number,
        required: true,
        default: 10
    },
    section: {
        type: Number,
        required: true
    },
    days: [{
        type: String,
        enum: Days,
    }],
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


export const OfferedCourse = mongoose.model<TOfferedCourse>('OfferedCourse', OfferedCourseSchema)
import { Schema, Types, model } from "mongoose";
import { TCourse, TCourseFaculty, TPreRequisiteCourses } from "./course.interface";
import { required } from "joi";


const preRequisiteCoursesSchema = new Schema<TPreRequisiteCourses>({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

const courseSchema = new Schema<TCourse>({
    title: {
        type: String,
        unique: true,
        trim: true,
        required: [true, "Title is Required!"]
    },
    prefix: {
        type: String,
        trim: true,
        required: [true, "Prefix is Required!"]
    },
    code: {
        type: Number,
        trim: true,
        required: [true, "Code is Required!"]
    },
    credits: {
        type: Number,
        trim: true,
        required: [true, "Code is Required!"]
    },
    preRequisiteCourses: [preRequisiteCoursesSchema],
    isDeleted: {
        type: Boolean,
        trim: true,
        required: true,
        default: false
    }
})


export const Course = model<TCourse>('Course', courseSchema)


const courseFacultySchema = new Schema<TCourseFaculty>({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        unique: true
    },
    faculties: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Faculty'
        }
    ]

})


export const CourseFaculty = model<TCourseFaculty>('CourseFaculty', courseFacultySchema)
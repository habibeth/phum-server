import httpStatus from "http-status";
import { AppError } from "../../error/AppError";
import { OfferedCourse } from "../OfferedCourse/OfferedCourse.model";
import { TEnrolledCourse } from "./enrolledCourse.interface";
import { EnrolledCourse } from "./enrolledCourse.model";
import { Student } from "../student/student.model";
import mongoose from "mongoose";
import { SemesterRegistration } from "../semesterRegisteration/semesterRegistration.model";
import { Course } from "../course/course.model";
import { Faculty } from "../faculty/faculty.model";

const createEnrolledCourseIntoDB = async (
    userId: string,
    payload: TEnrolledCourse,
) => {
    /**
     * Step1: Check if the offered courses is exists
     * Step2: Check if the student is already enrolled
     * Step3: Check if the max credits exceed
     * Step4: Create an enrolled course
     */
    const { offeredCourse } = payload;

    const isOfferedCourse = await OfferedCourse.findById(offeredCourse)
    if (!isOfferedCourse) {
        throw new AppError(httpStatus.NOT_FOUND, "Offered Course is not Exists!");
    }


    if (isOfferedCourse?.maxCapacity <= 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "Room is Full!");
    }

    const student = await Student.findOne({ id: userId }, { _id: 1 })
    if (!isOfferedCourse) {
        throw new AppError(httpStatus.NOT_FOUND, "Student is not Exists!");
    }

    const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
        semesterRegistration: isOfferedCourse.semesterRegistration,
        offeredCourse,
        student: student?._id
    })

    if (isStudentAlreadyEnrolled) {
        throw new AppError(httpStatus.FORBIDDEN, "You have Already Enrolled This Course!");
    }


    //course credit get
    const course = await Course.findById(isOfferedCourse?.course);
    const currentCredit = course?.credits

    //total credits gets
    const semesterRegistration = await SemesterRegistration.findById(isOfferedCourse?.semesterRegistration, { maxCredit: 1, status: 1 });

    const maxCredits = semesterRegistration?.maxCredit;

    //new enroll credit compare to max credits
    const enrolledCourses = await EnrolledCourse.aggregate([
        {
            $match: {
                semesterRegistration: isOfferedCourse?.semesterRegistration,
                student: student?._id
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'enrolledCourseData'
            }
        },
        {
            $unwind: '$enrolledCourseData'
        },
        {
            $group: {
                _id: null,
                totalEnrolledCredits: { $sum: '$enrolledCourseData.credits' }
            }
        },
        {
            $project: {
                _id: 0,
                totalEnrolledCredits: 1
            }
        }
    ]);

    //new enroll credit compare to max credits
    const totalCredits = enrolledCourses?.length > 0 ? enrolledCourses[0].totalEnrolledCredits : 0

    if (totalCredits && maxCredits && totalCredits + currentCredit > maxCredits) {
        throw new AppError(httpStatus.BAD_REQUEST, "You are exceeded maximum number of credits!")
    }




    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const result = await EnrolledCourse.create([{
            semesterRegistration: isOfferedCourse.semesterRegistration,
            academicSemester: isOfferedCourse.academicSemester,
            academicFaculty: isOfferedCourse.academicFaculty,
            academicDepartment: isOfferedCourse.academicDepartment,
            offeredCourse: offeredCourse,
            course: isOfferedCourse.course,
            student: student?._id,
            faculty: isOfferedCourse.faculty,
            isEnrolled: true,
        }], { session })

        if (!result) {
            throw new AppError(httpStatus.BAD_REQUEST, "Failed to Enrolled in This course!");
        }

        const maxCapacity = isOfferedCourse?.maxCapacity;
        await OfferedCourse.findByIdAndUpdate(offeredCourse, {
            maxCapacity: maxCapacity - 1
        }, { new: true })

        await session.commitTransaction();
        await session.endSession();

        return result;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }

};

const updateEnrolledCourseIntoDB = async (facultyId: string, payload: Partial<TEnrolledCourse>) => {
    const { semesterRegistration, offeredCourse, student, courseMarks } = payload;

    const semesterRegistrationExists = await SemesterRegistration.findById(semesterRegistration);

    if (!semesterRegistrationExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Semester Not Found!")
    }

    const offeredCourseExists = await OfferedCourse.findById(offeredCourse);

    if (!offeredCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Offered Course Not Found!")
    }

    const isStudentExists = await Student.findById(student);

    if (!isStudentExists) {
        throw new AppError(httpStatus.NOT_FOUND, "You are not Registered Student!")
    }

    const isFacultyExists = await Faculty.findOne({ id: facultyId }, { _id: 1 });
    if (!isFacultyExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Faculty not Found!")
    }



    const isCourseBelongFaculty = await EnrolledCourse.findOne({
        semesterRegistration,
        offeredCourse,
        student,
        faculty: isFacultyExists._id
    })
    if (!isCourseBelongFaculty) {
        throw new AppError(httpStatus.FORBIDDEN, "You are Forbidden!")
    }

    const modifiedData: Record<string, unknown> = {
        ...courseMarks
    }


    if (courseMarks && Object.keys(courseMarks).length) {
        for (const [key, value] of Object.entries(courseMarks)) {
            modifiedData[`courseMarks.${key}`] = value
        }
    }

    const result = await EnrolledCourse.findByIdAndUpdate(isCourseBelongFaculty._id, modifiedData, { new: true });
    return result
}

export const EnrolledCourseServices = {
    createEnrolledCourseIntoDB,
    updateEnrolledCourseIntoDB
}
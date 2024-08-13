import httpStatus from "http-status";
import { AppError } from "../../error/AppError";
import { SemesterRegistration } from "../semesterRegisteration/semesterRegistration.model";
import { TOfferedCourse } from "./OfferedCourse.interface";
import { OfferedCourse } from "./OfferedCourse.model";
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { Course } from "../course/course.model";
import { Faculty } from "../faculty/faculty.model";
import { hasTimeConflict } from "./OfferedCourse.utils";
import QueryBuilder from "../../builder/QueryBuilder";
import { Student } from "../student/student.model";





const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
    const { semesterRegistration, academicFaculty, academicDepartment, course, faculty, section, days, startTime, endTime } = payload;

    const isSemesterRegistrationExists = await SemesterRegistration.findById(semesterRegistration);
    if (!isSemesterRegistrationExists) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Semester Registration Not Found!')
    }
    const academicSemester = isSemesterRegistrationExists?.academicSemester;


    const isAcademicFacultyExists = await AcademicFaculty.findById(academicFaculty);
    if (!isAcademicFacultyExists) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Academic Faculty Not Found!')
    }



    const isAcademicDepartmentExists = await AcademicDepartment.findById(academicDepartment);
    if (!isAcademicDepartmentExists) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Academic Department Not Found!')
    }


    const isCourseExists = await Course.findById(course);
    if (!isCourseExists) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Course Not Found!')
    }


    const isFacultyExists = await Faculty.findById(faculty);
    if (!isFacultyExists) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Faculty Not Found!')
    }

    const isFacultyBelongToFaculty = await AcademicDepartment.findOne({
        academicFaculty,
        _id: academicDepartment
    })

    // console.log(isFacultyBelongToFaculty)

    if (!isFacultyBelongToFaculty) {
        throw new AppError(httpStatus.BAD_REQUEST, `This ${isAcademicFacultyExists.name} is not Belong to ${isAcademicDepartmentExists.name}`)
    }

    const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection = await OfferedCourse.findOne({
        semesterRegistration,
        course,
        section
    })

    if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
        throw new AppError(httpStatus.BAD_REQUEST, `This Offered Course Already Registered`)
    }

    const assignSchedules = await OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days }
    }).select('days startTime endTime');

    const newSchedule = {
        days,
        startTime,
        endTime
    }


    if (hasTimeConflict(assignSchedules, newSchedule)) {
        throw new AppError(httpStatus.BAD_REQUEST, `This Faculty is not available at this time please choose other time or Day!`)
    }


    const result = await OfferedCourse.create({ ...payload, academicSemester });
    return result;
};
const getAllOfferedCourseFromDB = async (query: Record<string, unknown>) => {
    const offeredCourseQuery = new QueryBuilder(
        OfferedCourse.find()
            .populate('semesterRegistration')
            .populate('academicSemester')
            .populate('academicFaculty')
            .populate('academicDepartment')
            .populate('course')
            .populate('faculty')
        , query)
        .filter()
        .sort()
        .paginate()
        .fields()

    const result = await offeredCourseQuery.modelQuery;
    const meta = await offeredCourseQuery.countTotal();

    return {
        meta,
        result
    }
};

const getMyOfferedCourseFromDB = async (userId: string, query: Record<string, unknown>) => {


    //pagination
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const skip = (page - 1) * limit;

    const student = await Student.findOne({ id: userId })
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not Found!')
    }

    const currentOngoingSemester = await SemesterRegistration.findOne({ status: 'ONGOING' })

    if (!currentOngoingSemester) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Semester not Found!');
    }

    const aggregationQuery = [
        {
            $match: {
                semesterRegistration: currentOngoingSemester?._id,
                academicFaculty: student?.academicFaculty,
                academicDepartment: student?.academicDepartment
            }
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'course'
            }
        },
        {
            $unwind: '$course'
        },
        {
            $lookup: {
                from: 'enrolledcourses',
                let: {
                    currentOngoingSemester: currentOngoingSemester?._id,
                    currentStudent: student?._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: [
                                            '$semesterRegistration',
                                            '$$currentOngoingSemester',
                                        ],
                                    },
                                    {
                                        $eq: [
                                            '$student',
                                            '$$currentStudent',
                                        ],
                                    },
                                    {
                                        $eq: [
                                            '$isEnrolled',
                                            true,
                                        ],
                                    },
                                ]
                            }
                        }
                    }
                ],
                as: 'enrolledCourses'
            }
        },
        {
            $lookup: {
                from: 'enrolledcourses',
                let: {
                    currentStudent: student?._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ['$student', '$$currentStudent']
                                    },
                                    {
                                        $eq: [
                                            '$isCompleted',
                                            true,
                                        ],
                                    },
                                ]
                            }
                        }
                    }
                ],
                as: 'completedCourses'
            }
        },
        {
            $addFields: {
                completedCourseIds: {
                    $map: {
                        input: '$completedCourses',
                        as: 'completed',
                        in: '$$completed.course'
                    }
                }
            }
        },
        {
            $addFields: {
                isPreRequisiteFulFilled: {
                    $or: [
                        { $eq: ['$course.preRequisiteCourses', []] },
                        { $setIsSubset: ['$course.preRequisiteCourses.course', '$completedCourseIds'] },
                    ]
                },
                isAlreadyEnrolled: {
                    $in: [
                        '$course._id',
                        {
                            $map: {
                                input: '$enrolledCourses',
                                as: 'enroll',
                                in: '$$enroll.course'
                            }
                        }
                    ]
                }
            }
        },
        {
            $match: {
                isPreRequisiteFulFilled: true,
                isAlreadyEnrolled: false
            }
        },

    ]

    const paginationQuery = [
        {
            $skip: skip
        },
        {
            $limit: limit
        },
    ]

    const result = await OfferedCourse.aggregate([...aggregationQuery, ...paginationQuery]);


    // pagination 


    const total = (await OfferedCourse.aggregate([...aggregationQuery])).length
    const totalPage = Math.ceil(total / limit);



    return {
        meta: {
            page,
            limit,
            total,
            totalPage
        },
        result
    };
};

const getSingleOfferedCourseFromDB = async (id: string) => {
    const result = await OfferedCourse.findById(id);
    return result;
};

const updateOfferedCourseIntoDB = async (id: string, payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>) => {
    const { faculty, days, startTime, endTime } = payload;

    const isOfferedCourseExists = await OfferedCourse.findById(id);
    if (!isOfferedCourseExists) {
        throw new AppError(httpStatus.BAD_REQUEST, 'This Offered Course is not Exists!')
    }

    const isFacultyExists = await Faculty.findById(faculty);
    if (!isFacultyExists) {
        throw new AppError(httpStatus.BAD_REQUEST, 'This Faculty is not Exists!')
    }

    const semesterRegistration = isOfferedCourseExists.semesterRegistration;

    const semesterRegistrationStatus = await SemesterRegistration.findById(semesterRegistration);

    if (semesterRegistrationStatus?.status !== 'UPCOMING') {
        throw new AppError(httpStatus.BAD_REQUEST, `You cannot Update this Offered Course as it is ${semesterRegistrationStatus?.status}!`)
    }

    const assignSchedules = await OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days }
    }).select('days startTime endTime');

    const newSchedule = {
        days,
        startTime,
        endTime
    }


    if (hasTimeConflict(assignSchedules, newSchedule)) {
        throw new AppError(httpStatus.BAD_REQUEST, `This Faculty is not available at this time please choose other time or Day!`)
    }


    const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
    });
    return result;
};

const deleteOfferedCourseFromDB = async (id: string) => {

    // const result = await .findByIdAndUpdate(
    //     id,
    //     { isDeleted: true },
    //     { new: true },
    // );
    // return result;
};

export const OfferedCourseServices = {
    createOfferedCourseIntoDB,
    getAllOfferedCourseFromDB,
    getSingleOfferedCourseFromDB,
    updateOfferedCourseIntoDB,
    deleteOfferedCourseFromDB,
    getMyOfferedCourseFromDB
};
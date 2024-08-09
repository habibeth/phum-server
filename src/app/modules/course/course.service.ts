import QueryBuilder from "../../builder/QueryBuilder";
import { CourseSearchableFields } from "./course.constant";
import { TCourse, TCourseFaculty } from "./course.interface"
import { Course, CourseFaculty } from "./course.model"

const createCourseIntoDB = async (payload: TCourse) => {
    const result = await Course.create(payload);
    return result
}

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
    const courseQuery = new QueryBuilder(Course.find().populate('preRequisiteCourses.course'), query)
        .search(CourseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = await courseQuery.modelQuery;
    return result;
}


const getSingleCourseFromDB = async (id: string) => {
    const result = await Course.findById(id).populate('preRequisiteCourses.course')
    return result;
}

const deleteCourseFromDB = async (id: string) => {
    const result = await Course.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
    )
    return result;
}

const updateCourseFromDB = async (id: string, payload: Partial<TCourse>) => {

    const { preRequisiteCourses, ...courseReamingData } = payload

    const updateBasicInfoCourseData = await Course.findByIdAndUpdate(
        id,
        courseReamingData,
        { new: true, runValidators: true }
    )

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
        const deletePreRequisiteField = preRequisiteCourses.filter(el => el.course && el.isDeleted).map(el => el.course)

        const deletePreRequisiteCourse = await Course.findByIdAndUpdate(
            id,
            {
                $pull: { preRequisiteCourses: { course: { $in: deletePreRequisiteField } } }
            },
            { new: true }
        )

        const newPreRequisite = preRequisiteCourses?.filter(el => el.course && !el.isDeleted);

        const newPreRequisiteCourses = await Course.findByIdAndUpdate(
            id,
            { $addToSet: { preRequisiteCourses: { $each: newPreRequisite } } }
        )
    }

    const result = await Course.findById(id).populate('preRequisiteCourses.course');

    return result;
}

const assignFacultiesWithCourseIntoDB = async (id: string, payload: Partial<TCourseFaculty>) => {
    const result = await CourseFaculty.findByIdAndUpdate(id,
        {
            course: id,
            $addToSet: { faculties: { $each: payload } }
        },
        {
            upsert: true,
            new: true
        }
    )

    return result;
}

const removeFacultiesFromCourseIntoDB = async (id: string, payload: Partial<TCourseFaculty>) => {
    const result = await CourseFaculty.findByIdAndUpdate(id,
        {
            $pull: { faculties: { $in: payload } }
        },
        {
            upsert: true,
            new: true
        }
    )

    return result;
}


export const CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getSingleCourseFromDB,
    deleteCourseFromDB,
    updateCourseFromDB,
    assignFacultiesWithCourseIntoDB,
    removeFacultiesFromCourseIntoDB
}
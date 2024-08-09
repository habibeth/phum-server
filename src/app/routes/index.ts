import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { StudentRoutes } from "../modules/student/student.route";
import { AcademicSemesterRoutes } from "../modules/academicSemester/academicSemester.route";
import { AcademicFacultyRoutes } from "../modules/academicFaculty/academicFaculty.route";
import { AcademicDepartmentRoutes } from "../modules/academicDepartment/academicDepartment.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { FacultyRoutes } from "../modules/faculty/faculty.route";
import { CourseRoutes } from "../modules/course/course.route";
import { semesterRegistrationRoutes } from "../modules/semesterRegisteration/semesterRegistration.route";
import { offeredCourseRoutes } from "../modules/OfferedCourse/OfferedCourse.route";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { EnrolledCourseRoutes } from "../modules/enrolledCourse/enrolledCourse.route";


const router = Router()

const moduleRoute = [
    {
        path: '/users',
        route: UserRoutes,
    },
    {
        path: '/students',
        route: StudentRoutes,
    },
    {
        path: '/academic-semesters',
        route: AcademicSemesterRoutes,
    },
    {
        path: '/academic-faculty',
        route: AcademicFacultyRoutes,
    },
    {
        path: '/academic-department',
        route: AcademicDepartmentRoutes,
    },
    {
        path: '/faculty',
        route: FacultyRoutes,
    },
    {
        path: '/admin',
        route: AdminRoutes,
    },
    {
        path: '/courses',
        route: CourseRoutes,
    },
    {
        path: '/semester-registration',
        route: semesterRegistrationRoutes,
    },
    {
        path: '/offered-courses',
        route: offeredCourseRoutes,
    },
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/enrolled-course',
        route: EnrolledCourseRoutes
    },
]



moduleRoute?.forEach(route => router.use(route.path, route.route))




export default router;
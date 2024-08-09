import { Router } from "express";
import { AcademicFacultyController } from "./academicFaculty.controller";
import validateRequest from "../../middleware/validateRequest";
import { AcademicFacultyValidation } from "./academicFaculty.validation";
import { USER_ROLE } from "../user/user.constant";
import auth from "../../middleware/auth";

const route = Router();

route.post(
    '/create-academic-faculty',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(AcademicFacultyValidation.createAcademicFacultyValidationSchema),
    AcademicFacultyController.createAcademicFaculty
);
route.get(
    '/',
    AcademicFacultyController.getAllAcademicFaculties
);
route.get(
    '/:facultyId',
    AcademicFacultyController.getSingleAcademicFaculty
);
route.patch(
    '/:facultyId',
    validateRequest(AcademicFacultyValidation.updateAcademicFacultyValidationSchema),
    AcademicFacultyController.updateSingleAcademicFaculty
);



export const AcademicFacultyRoutes = route
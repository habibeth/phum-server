import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { AcademicDepartmentValidation } from "./academicDepartment.validation";
import { AcademicDepartmentController } from "./academicDepartment.controller";


const route = Router()

route.post('/create-academic-department', validateRequest(AcademicDepartmentValidation.createAcademicDepartmentValidationSchema), AcademicDepartmentController.createAcademicDepartment);
route.get('/', AcademicDepartmentController.getAllAcademicDepartment);
route.get('/:departmentId', AcademicDepartmentController.getSingleAcademicDepartment);
route.patch('/:departmentId', validateRequest(AcademicDepartmentValidation.updateAcademicDepartmentValidationSchema), AcademicDepartmentController.updateAcademicDepartment);


export const AcademicDepartmentRoutes = route;
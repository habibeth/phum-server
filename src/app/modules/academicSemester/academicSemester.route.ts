import { Router } from "express";
import { AcademicSemesterController } from "./academicSemester.controller";
import validateRequest from "../../middleware/validateRequest";
import { AcademicSemesterValidations } from "./academicValidation.validation";


const router = Router();

router.post('/create-academic-semester', validateRequest(AcademicSemesterValidations.createAcademicSemesterValidationSchema), AcademicSemesterController.createAcademicSemester);
router.get('/', AcademicSemesterController.getAllAcademicSemester);
router.get('/:semesterId', AcademicSemesterController.getAcademicSemester);
router.patch('/:semesterId', validateRequest(AcademicSemesterValidations.updateAcademicSemesterValidationSchema), AcademicSemesterController.updateAcademicSemester);


export const AcademicSemesterRoutes = router;
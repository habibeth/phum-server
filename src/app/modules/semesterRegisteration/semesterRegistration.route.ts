import { Router } from "express";
import { SemesterRegistrationControllers } from "./semesterRegistration.controller";
import validateRequest from "../../middleware/validateRequest";
import { SemesterRegistrationValidation } from "./semesterRegistration.validation";



const router = Router();

router.get('/:id', SemesterRegistrationControllers.getSingleSemesterRegistration);
router.post('/create-semester-registration', validateRequest(SemesterRegistrationValidation.createSemesterRegistrationValidation), SemesterRegistrationControllers.createSemesterRegistration);

router.patch(
    '/:id',
    validateRequest(SemesterRegistrationValidation.updateSemesterRegistrationValidation),
    SemesterRegistrationControllers.updateSemesterRegistration,
);

router.get('/', SemesterRegistrationControllers.getAllSemesterRegistration);
router.delete('/:id', SemesterRegistrationControllers.deleteSemesterRegistration);


export const semesterRegistrationRoutes = router;
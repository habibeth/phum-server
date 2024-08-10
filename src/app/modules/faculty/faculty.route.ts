import express from 'express'
import { FacultyControllers } from './faculty.controller';
import validateRequest from '../../middleware/validateRequest';
import { updateFacultyValidationSchema } from './faculty.validation';

const router = express.Router();

router.get('/:id', FacultyControllers.getSingleFaculty);

router.patch(
    '/:id',
    validateRequest(updateFacultyValidationSchema),
    FacultyControllers.updateFaculty,
);

router.get('/', FacultyControllers.getAllFaculties);
router.delete('/:id', FacultyControllers.deleteFaculty);

export const FacultyRoutes = router;
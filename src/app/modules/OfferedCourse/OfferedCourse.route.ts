import { Router } from "express";
import { OfferedCourseControllers } from "./OfferedCourse.controller";
import validateRequest from "../../middleware/validateRequest";
import { OfferedCourseValidation } from "./OfferedCourse.validation";




const router = Router();

router.get('/:id', OfferedCourseControllers.getSingleOfferedCourse);
router.post('/create-offered-course', validateRequest(OfferedCourseValidation.createOfferedCourseSchemaValidation), OfferedCourseControllers.createOfferedCourse);

router.patch(
    '/:id',
    validateRequest(OfferedCourseValidation.updateOfferedCourseSchemaValidation),
    OfferedCourseControllers.updateOfferedCourse,
);

router.get('/', OfferedCourseControllers.getAllOfferedCourse);
router.delete('/:id', OfferedCourseControllers.deleteOfferedCourse);


export const offeredCourseRoutes = router;
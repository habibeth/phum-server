import { Router } from "express";
import { OfferedCourseControllers } from "./OfferedCourse.controller";
import validateRequest from "../../middleware/validateRequest";
import { OfferedCourseValidation } from "./OfferedCourse.validation";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";




const router = Router();


router.get(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
    OfferedCourseControllers.getAllOfferedCourse
);
router.get(
    '/get-offered-courses',
    auth(USER_ROLE.student),
    OfferedCourseControllers.getMyOfferedCourse
);
router.get('/:id', OfferedCourseControllers.getSingleOfferedCourse);
router.post('/create-offered-course', validateRequest(OfferedCourseValidation.createOfferedCourseSchemaValidation), OfferedCourseControllers.createOfferedCourse);
router.patch(
    '/:id',
    validateRequest(OfferedCourseValidation.updateOfferedCourseSchemaValidation),
    OfferedCourseControllers.updateOfferedCourse,
);
router.delete('/:id', OfferedCourseControllers.deleteOfferedCourse);


export const offeredCourseRoutes = router;
import { z } from "zod";
import { Days } from "./OfferedCourse.constant";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
export const createOfferedCourseSchemaValidation = z.object({
    body: z.object({
        semesterRegistration: z.string(),
        academicFaculty: z.string(),
        academicDepartment: z.string(),
        course: z.string(),
        faculty: z.string(),
        maxCapacity: z.number(),
        section: z.number(),
        days: z.array(z.enum([...Days] as [string, ...string[]])),
        startTime: z.string().regex(timeRegex, {
            message: "Start time must be in HH:MM format",
        }),
        endTime: z.string().regex(timeRegex, {
            message: "Start time must be in HH:MM format",
        }),
    }).refine((body) => {
        const [startHour, startMinute] = body.startTime.split(':').map(Number);
        const [endHour, endMinute] = body.endTime.split(':').map(Number);
        const startTime = new Date(0, 0, 0, startHour, startMinute);
        const endTime = new Date(0, 0, 0, endHour, endMinute);
        return startTime < endTime;
    }, {
        message: "Start time must be before end time",
        path: ["endTime"],
    })
});

export const updateOfferedCourseSchemaValidation = z.object({
    body: z.object({
        faculty: z.string(),
        maxCapacity: z.number(),
        days: z.array(z.enum([...Days] as [string, ...string[]])),
        startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
            message: "Start time must be in HH:MM format",
        }),
        endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
            message: "Start time must be in HH:MM format",
        }),
    }).refine((body) => {
        const [startHour, startMinute] = body.startTime.split(':').map(Number);
        const [endHour, endMinute] = body.endTime.split(':').map(Number);
        const startTime = new Date(0, 0, 0, startHour, startMinute);
        const endTime = new Date(0, 0, 0, endHour, endMinute);
        return startTime < endTime;
    }, {
        message: "Start time must be before end time",
        path: ["endTime"],
    })
});

export const OfferedCourseValidation = {
    createOfferedCourseSchemaValidation,
    updateOfferedCourseSchemaValidation
}
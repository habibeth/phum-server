import { z } from "zod";
import { UserStatus } from "./user.constant";

const userValidationSchema = z.object({
    password: z.string({
        invalid_type_error: "Password must be String"
    }).max(20, { message: "Password cannot more than 20" }).optional(),
})

const userStatusValidationSchema = z.object({
    body: z.object({
        status: z.enum([...UserStatus] as [string, ...string[]]),
    })
})

export const UserValidation = {
    userValidationSchema,
    userStatusValidationSchema
}
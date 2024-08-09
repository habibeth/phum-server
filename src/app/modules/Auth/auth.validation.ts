import { z } from "zod";


const loginValidationSchema = z.object({
    body: z.object({
        id: z.string({ required_error: 'Id is Required' }),
        password: z.string({ required_error: 'Password is Required' }),

    })
})

const refreshTokenValidationSchema = z.object({
    cookies: z.object({
        refreshToken: z.string({
            required_error: 'Refresh token is required!',
        }),
    }),
})

const changePasswordValidationSchema = z.object({
    body: z.object({
        oldPassword: z.string({ required_error: 'Old Password does not Match' }),
        newPassword: z.string({ required_error: 'Password is Required' }),

    })
})


const forgetPasswordValidationSchema = z.object({
    body: z.object({
        id: z.string({ required_error: 'User ID is Required' }),
    })
})

const resetPasswordValidationSchema = z.object({
    body: z.object({
        id: z.string({ required_error: 'User ID is Required' }),
        newPassword: z.string({ required_error: 'Password is Required' }),
    })
})

export const AuthValidation = {
    loginValidationSchema,
    changePasswordValidationSchema,
    refreshTokenValidationSchema,
    resetPasswordValidationSchema,
    forgetPasswordValidationSchema
}
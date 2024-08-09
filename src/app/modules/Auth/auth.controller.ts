import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
    const result = await AuthServices.loginUser(req.body);
    const { accessToken, refreshToken, needPasswordChange } = result;
    res.cookie('refreshToken', refreshToken, {
        secure: config.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: true,
    })
    sendResponse(res, {
        data: {
            accessToken,
            needPasswordChange
        },
        message: "User Login Successfully!"
    })
})

const changePassword = catchAsync(async (req, res) => {
    const user = req.user;
    // console.log(user, req.body)
    const { ...passwordData } = req.body
    const result = await AuthServices.changePassword(user, passwordData)
    sendResponse(res, {
        data: result,
        message: "Password Change Successfully"
    })
})

const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies
    const result = await AuthServices.refreshToken(refreshToken);

    sendResponse(res, {
        data: result,
        message: "Access Token is retrieved Successfully!"
    })
})

const forgetPassword = catchAsync(async (req, res) => {
    const userId = req.body.id
    const result = await AuthServices.forgetPassword(userId)
    sendResponse(res, {
        data: result,
        message: "Reset Link Generated Successfully!"
    })
})


const resetPassword = catchAsync(async (req, res) => {
    const token = req.headers.authorization;
    const result = await AuthServices.resetPassword(req.body, token as string)
    sendResponse(res, {
        data: result,
        message: "Password was change Successfully!!"
    })
})



export const AuthControllers = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
}
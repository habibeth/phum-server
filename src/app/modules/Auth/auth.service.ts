import httpStatus from "http-status";
import { AppError } from "../../error/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from "../../config";
import bcrypt from 'bcrypt';
import { createToken, verifyToken } from "./auth.utils";
import { sendEmail } from "../../utils/sendEmail";

const loginUser = async (payload: TLoginUser) => {
    //checking user exists
    const user = await User.isUserExistsByCustomId(payload.id)


    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This User is not Found!')
    }

    //checking user delete or not
    const isDeleted = user?.isDeleted
    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, "This User is Already Deleted")
    }

    //checking user status
    const userStatus = user?.status
    if (userStatus === "blocked") {
        throw new AppError(httpStatus.FORBIDDEN, "This User is Blocked")
    }

    //checking password
    const isPasswordMatch = await User.isPasswordMatched(payload.password, user.password)
    // console.log(isPasswordMatch)
    if (!isPasswordMatch) {
        throw new AppError(httpStatus.FORBIDDEN, "Password is not Matched")
    }


    // create token 


    const jwtPayload = {
        userId: user.id,
        role: user.role
    }

    const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expire_in as string)
    const refreshToken = createToken(jwtPayload, config.jwt_refresh_secret as string, config.jwt_refresh_expire_in as string)

    return {
        accessToken,
        refreshToken,
        needPasswordChange: user.needPasswordChange
    }
}

const changePassword = async (userData: JwtPayload, payload: { oldPassword: string, newPassword: string }) => {

    const user = await User.isUserExistsByCustomId(userData.userId)

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This User is not Found!')
    }

    //checking user delete or not
    const isDeleted = user?.isDeleted
    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, "This User is Already Deleted")
    }

    //checking user status
    const userStatus = user?.status
    if (userStatus === "blocked") {
        throw new AppError(httpStatus.FORBIDDEN, "This User is Blocked")
    }

    //checking password
    const isPasswordMatch = await User.isPasswordMatched(payload.oldPassword, user.password)
    if (!isPasswordMatch) {
        throw new AppError(httpStatus.FORBIDDEN, "Password is not Matched")
    }

    //hashed new Password
    const newHashedPassword = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_rounds))

    const result = await User.findOneAndUpdate({
        id: userData.userId,
        role: userData.role
    }, {
        password: newHashedPassword,
        needPasswordChange: false,
        passwordChangedAt: new Date(),
    })

    return null
}

const refreshToken = async (token: string) => {

    //check validated token

    const decoded = verifyToken(token, config.jwt_refresh_secret as string)


    const { userId, iat } = decoded
    //checking user exists
    const user = await User.isUserExistsByCustomId(userId)


    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This User is not Found!')
    }

    //checking user delete or not
    const isDeleted = user?.isDeleted
    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, "This User is Already Deleted")
    }

    //checking user status
    const userStatus = user?.status
    if (userStatus === "blocked") {
        throw new AppError(httpStatus.FORBIDDEN, "This User is Blocked")
    }

    if (user?.passwordChangedAt && User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not Authorize Person!")
    }

    const jwtPayload = {
        userId: user.id,
        role: user.role
    };

    const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expire_in as string);

    return {
        accessToken
    }
}
const forgetPassword = async (userId: string) => {
    const user = await User.isUserExistsByCustomId(userId)
    //check user exists on DB
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This User is not Found!')
    }

    //checking user delete or not
    const isDeleted = user?.isDeleted
    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, "This User is Already Deleted")
    }

    //checking user status
    const userStatus = user?.status
    if (userStatus === "blocked") {
        throw new AppError(httpStatus.FORBIDDEN, "This User is Blocked")
    }


    const jwtPayload = {
        userId: user.id,
        role: user.role
    };

    const resetToken = createToken(jwtPayload, config.jwt_access_secret as string, '10m');


    const resetUILink = `${config.reset_password_ui_link}?id=${user?.id}&token=${resetToken}`
    sendEmail(user.email, resetUILink)
    console.log(resetUILink)
}
const resetPassword = async (payload: { id: string, newPassword: string }, token: string) => {

    const decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;

    console.log(decoded)
    const { userId, role } = decoded;

    if (userId !== payload.id) {
        throw new AppError(httpStatus.FORBIDDEN, "User ID Don't Match")
    }

    //checking user exists
    const user = await User.isUserExistsByCustomId(payload.id)


    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This User is not Found!')
    }

    //checking user delete or not
    const isDeleted = user?.isDeleted
    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, "This User is Already Deleted")
    }

    //checking user status
    const userStatus = user?.status
    if (userStatus === "blocked") {
        throw new AppError(httpStatus.FORBIDDEN, "This User is Blocked")
    }

    const newHashedPassword = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_rounds));

    const result = await User.findOneAndUpdate({
        id: userId,
        role: role
    }, {
        password: newHashedPassword,
        passwordChangedAt: new Date(),
    })
}

export const AuthServices = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword
}
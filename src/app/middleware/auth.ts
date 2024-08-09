import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync"
import { AppError } from "../error/AppError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from "../config";
import { TUserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";



const auth = (...requiredRoles: TUserRole[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization;
        //check token  exists
        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are not Authorize Persons!")
        }

        //check validated token

        const decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;


        const { role, userId, iat } = decoded
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


        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are not Authorize Person!")
        }
        req.user = decoded as JwtPayload;
        next()
    })
}

export default auth;
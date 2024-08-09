import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface TUser {
    id: string;
    email: string;
    password: string;
    needPasswordChange: boolean;
    passwordChangedAt?: Date;
    role: 'superAdmin' | 'admin' | 'faculty' | 'student';
    status: 'in-progress' | 'blocked';
    isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
    // myStaticMethod(): number;
    isUserExistsByCustomId(id: string): Promise<TUser>
    isPasswordMatched(plainTextPassword: string, hashedPassword: string): Promise<boolean>
    isJWTIssuedBeforePasswordChanged(passwordChangedTimestamp: Date, jwtIssuedTimestamp: number): boolean
}

export type TUserRole = keyof typeof USER_ROLE
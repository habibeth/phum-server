import { Schema, model } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import config from "../../config";
import bcrypt from 'bcrypt';
import { UserStatus } from "./user.constant";

const userSchema = new Schema<TUser, UserModel>({
    id: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: 0
    },
    needPasswordChange: {
        type: Boolean,
        default: true
    },
    passwordChangedAt: {
        type: Date,
    },
    role: {
        type: String,
        enum: ['superAdmin', 'admin', 'faculty', 'student']
    },
    status: {
        type: String,
        enum: UserStatus,
        default: 'in-progress'
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
})


/**
 * before save password Hashed
 */
userSchema.pre('save', async function (next) {
    // console.log(this, "Student Schema Before The Save Data!");
    // password Hashing 
    const user = this; //documents
    user.password = await bcrypt.hash(
        user.password,
        Number(config.bcrypt_salt_rounds)
    );

    next();
})


//set empty string 
userSchema.post('save', async function (doc, next) {
    doc.password = ""
    // console.log(this, "Student Schema After The Save Data!");
    next()
})


userSchema.statics.isUserExistsByCustomId = async function (id: string) {
    return await User.findOne({ id }).select('+password')
}


userSchema.statics.isPasswordMatched = async function (plainTextPassword, hashedPassword) {
    return await bcrypt.compare(plainTextPassword, hashedPassword)
}

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (passwordChangedTimestamp, jwtIssuedTimestamp) {
    const passwordChangedTime = new Date(passwordChangedTimestamp).getTime() / 1000;
    return passwordChangedTime > jwtIssuedTimestamp
}






export const User = model<TUser, UserModel>("User", userSchema)
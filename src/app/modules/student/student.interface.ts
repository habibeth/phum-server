import { Model, Types } from "mongoose";
import { TUserName } from "../../interface/userInfoInterface";

export type TGuardians = {
    fatherName: string;
    fatherOccupation: string;
    fatherContactNo: string;
    motherName: string;
    motherOccupation: string;
    motherContactNo: string;
}

export type TLocalGuardians = {
    name: string;
    occupation: string;
    contactNo: string;
    address: string;
}

export type TStudent = {
    id: string;
    user: Types.ObjectId;
    name: TUserName;
    gender: "male" | "female" | "other";
    dateOfBirth?: Date;
    email: string;
    contactNo: string;
    emergencyContactNo: string;
    bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    presentAddress: string;
    permanentAddress: string;
    guardian: TGuardians;
    localGuardian: TLocalGuardians;
    profileImage?: string;
    admissionSemester: Types.ObjectId;
    isDeleted: boolean;
    academicDepartment: Types.ObjectId;
    academicFaculty: Types.ObjectId;
}


//custom static methods

export interface StudentModel extends Model<TStudent> {
    isUserExists(id: string): Promise<TStudent | null>
}


//custom instance method

// export type StudentMethods = {
//     isUserExists(id: string): Promise<TStudent | null>
// }

// export type StudentModel = Model<TStudent, {}, StudentMethods>

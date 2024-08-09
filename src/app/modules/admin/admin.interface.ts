import { Model, Types } from 'mongoose';
import { TBloodGroup, TGender, TUserName } from '../../interface/userInfoInterface';


export type TAdmin = {
    id: string;
    user: Types.ObjectId;
    designation: string;
    name: TUserName;
    gender: TGender;
    dateOfBirth?: Date;
    email: string;
    contactNo: string;
    emergencyContactNo: string;
    bloodGroup?: TBloodGroup;
    presentAddress: string;
    permanentAddress: string;
    profileImage?: string;
    isDeleted: boolean;
};

export interface AdminModel extends Model<TAdmin> {
    isUserExists(id: string): Promise<TAdmin | null>;
}
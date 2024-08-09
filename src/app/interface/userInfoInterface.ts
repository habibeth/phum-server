export type TGender = 'male' | 'female' | 'other';
export type TBloodGroup =
    | 'A+'
    | 'A-'
    | 'B+'
    | 'B-'
    | 'AB+'
    | 'AB-'
    | 'O+'
    | 'O-';

export type TUserName = {
    firstName: string;
    middleName: string;
    lastName: string;
};
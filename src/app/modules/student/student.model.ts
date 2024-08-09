import { Schema, model } from 'mongoose';
import { StudentModel, TGuardians, TLocalGuardians, TStudent } from './student.interface';
import validator from 'validator';
import { AppError } from '../../error/AppError';
import httpStatus from 'http-status';
import { TUserName } from '../../interface/userInfoInterface';

const userNameSchema = new Schema<TUserName>({
    firstName: {
        type: String,
        required: [true, "First Name is Required!"],
        trim: true,
        maxLength: [20, "First Name must be less than 20 Character"],
        validate: {
            validator: function (value: string) {
                const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
                return firstNameStr === value
            },
            message: "Your name {VALUE} is not capitalize"
        }
    },
    middleName: { type: String, trim: true, },
    lastName: {
        type: String,
        required: [true, "Last Name is Required!"],
        trim: true,
        validate: {
            validator: (value: string) => validator.isAlpha(value),
            message: '{VALUE} is not valid'
        }
    }
});

const guardiansSchema = new Schema<TGuardians>({
    fatherName: { type: String, required: [true, "Father's Name is Required!"] },
    fatherOccupation: { type: String, required: [true, "Father's Occupation is Required!"] },
    fatherContactNo: { type: String, required: [true, "Father's Contact Number is Required!"] },
    motherName: { type: String, required: [true, "Mother's Name is Required!"] },
    motherOccupation: { type: String, required: [true, "Mother's Occupation is Required!"] },
    motherContactNo: { type: String, required: [true, "Mother's Contact Number is Required!"] },
});

const localGuardiansSchema = new Schema<TLocalGuardians>({
    name: { type: String, required: [true, "Local Guardian's Name is Required!"] },
    occupation: { type: String, required: [true, "Local Guardian's Occupation is Required!"] },
    contactNo: { type: String, required: [true, "Local Guardian's Contact Number is Required!"] },
    address: { type: String, required: [true, "Local Guardian's Address is Required!"] },
});

const studentSchema = new Schema<TStudent, StudentModel>({
    id: { type: String, required: [true, "Student ID is Required!"], unique: true, trim: true, },
    user: {
        type: Schema.Types.ObjectId,
        required: [true, "User id is Required"],
        unique: true,
        ref: 'User',
    },
    name: {
        type: userNameSchema,
        required: [true, "Student's Name is Required!"]
    },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "other"],
            message: "Gender must be either male, female, or other"
        },
        trim: true,
        required: [true, "Gender is Required!"]
    },
    dateOfBirth: { type: Date },
    email: {
        type: String,
        required: [true, "Email is Required!"],
        unique: true,
        trim: true,
        validate: {
            validator: (value: string) => validator.isEmail(value),
            message: "{VALUE} is not a valid email"
        }
    },
    contactNo: { type: String, required: [true, "Contact Number is Required!"], trim: true, },
    emergencyContactNo: { type: String, required: [true, "Emergency Contact Number is Required!"], trim: true, },
    bloodGroup: {
        type: String,
        trim: true,
        enum: {
            values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            message: "Blood Group must be one of 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'"
        }
    },
    presentAddress: { type: String, required: [true, "Present Address is Required!"] },
    permanentAddress: { type: String, required: [true, "Permanent Address is Required!"] },
    guardian: {
        type: guardiansSchema,
        required: [true, "Guardians Information is Required!"]
    },
    localGuardian: {
        type: localGuardiansSchema,
        required: [true, "Local Guardians Information is Required!"]
    },
    profileImage: { type: String, trim: true, default: '' },
    admissionSemester: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'AcademicSemester'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    academicDepartment: {
        type: Schema.Types.ObjectId,
        ref: 'AcademicDepartment'
    },
    academicFaculty: {
        type: Schema.Types.ObjectId,
        ref: 'AcademicFaculty'
    },

}, {
    toJSON: {
        virtuals: true
    }
}
);


//virtual
studentSchema.virtual('fullName').get(function () {
    return (
        `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`
    )
})




studentSchema.pre('find', async function (next) {
    this.find({ isDeleted: { $ne: true } })

    next()
})

studentSchema.pre('findOne', async function (next) {
    this.find({ isDeleted: { $ne: true } })

    next()
})

studentSchema.pre('aggregate', async function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } })

    next()
})

// studentSchema.pre("findOneAndUpdate", async function (next) {
//     const query = this.getQuery()
//     const existingUser = await Student.findOne(query);
//     if (!existingUser) {
//         throw new AppError(httpStatus.NOT_FOUND, "User not found!")
//     }
// })


//custom static methods
studentSchema.statics.isUserExists = async function (id: string) {
    const existingUser = await Student.findOne({ id });
    return existingUser;
}



export const Student = model<TStudent, StudentModel>("Student", studentSchema)
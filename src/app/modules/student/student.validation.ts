import { z } from "zod";

// UserName schema

const createUserNameValidationSchema = z.object({
    firstName: z
        .string()
        .min(1)
        .max(20)
        .refine((value) => /^[A-Z]/.test(value), {
            message: 'First Name must start with a capital letter',
        }),
    middleName: z.string().optional(),
    lastName: z.string()
});

// Guardians schema
const createGuardiansValidationSchema = z.object({
    fatherName: z.string(),
    fatherOccupation: z.string(),
    fatherContactNo: z.string(),
    motherName: z.string(),
    motherOccupation: z.string(),
    motherContactNo: z.string(),
});

// LocalGuardians schema
const createLocalGuardiansValidationSchema = z.object({
    name: z.string(),
    occupation: z.string(),
    contactNo: z.string(),
    address: z.string(),
});

// Student schema
const createStudentValidationSchema = z.object({
    body: z.object({
        password: z.string().max(20, { message: "Password Maximum 20 Character" }).optional(),
        student: z.object({
            name: createUserNameValidationSchema,
            gender: z.enum(["male", "female", "other"]),
            dateOfBirth: z.string().optional(),
            email: z.string()
                .email({ message: "Invalid email address" }),
            contactNo: z.string(),
            emergencyContactNo: z.string(),
            bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
            presentAddress: z.string(),
            permanentAddress: z.string(),
            guardian: createGuardiansValidationSchema,
            localGuardian: createLocalGuardiansValidationSchema,
            admissionSemester: z.string(),
            profileImage: z.string().trim().optional(),
            academicDepartment: z.string(),
        })
    })
});


const updateUserNameValidationSchema = z.object({
    firstName: z
        .string()
        .min(1)
        .max(20)
        .refine((value) => /^[A-Z]/.test(value), {
            message: 'First Name must start with a capital letter',
        }).optional(),
    middleName: z.string().optional(),
    lastName: z.string().optional()
});

// Guardians schema
const updateGuardiansValidationSchema = z.object({
    fatherName: z.string().optional(),
    fatherOccupation: z.string().optional(),
    fatherContactNo: z.string().optional(),
    motherName: z.string().optional(),
    motherOccupation: z.string().optional(),
    motherContactNo: z.string().optional(),
});

// LocalGuardians schema
const updateLocalGuardiansValidationSchema = z.object({
    name: z.string().optional(),
    occupation: z.string().optional(),
    contactNo: z.string().optional(),
    address: z.string().optional(),
});

// Student schema
const updateStudentValidationSchema = z.object({
    body: z.object({
        password: z.string().max(20, { message: "Password Maximum 20 Character" }).optional(),
        student: z.object({
            name: updateUserNameValidationSchema.optional(),
            gender: z.enum(["male", "female", "other"]).optional(),
            dateOfBirth: z.string().optional(),
            email: z.string().email({ message: "Invalid email address" }).optional(),
            contactNo: z.string().optional(),
            emergencyContactNo: z.string().optional(),
            bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
            presentAddress: z.string().optional(),
            permanentAddress: z.string().optional(),
            guardians: updateGuardiansValidationSchema.optional(),
            localGuardians: updateLocalGuardiansValidationSchema.optional(),
            admissionSemester: z.string().optional(),
            profileImage: z.string().trim().optional(),
            academicDepartment: z.string().optional()
        })
    })
});


export const studentValidations = {
    createStudentValidationSchema,
    updateStudentValidationSchema
}

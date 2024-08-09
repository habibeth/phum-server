// import Joi from "joi";

// const userNameValidationSchema = Joi.object({
//     firstName: Joi.string()
//         .trim()
//         .max(20)
//         .required()
//         .regex(/^[A-Z][a-z]*$/)
//         .messages({
//             'string.empty': 'First Name is Required!',
//             'string.max': 'First Name must be less than 20 characters',
//             'string.pattern.base': 'Your name {#value} is not capitalized'
//         }),
//     middleName: Joi.string()
//         .trim()
//         .optional(),
//     lastName: Joi.string()
//         .trim()
//         .required()
//         .regex(/^[a-zA-Z]+$/)
//         .messages({
//             'string.empty': 'Last Name is Required!',
//             'string.pattern.base': '{#value} is not valid'
//         })
// });

// // Guardians Validationschema
// const guardiansValidationSchema = Joi.object({
//     fatherName: Joi.string().required().messages({
//         'string.empty': "Father's Name is Required!"
//     }),
//     fatherOccupation: Joi.string().required().messages({
//         'string.empty': "Father's Occupation is Required!"
//     }),
//     fatherContactNo: Joi.string().required().messages({
//         'string.empty': "Father's Contact Number is Required!"
//     }),
//     motherName: Joi.string().required().messages({
//         'string.empty': "Mother's Name is Required!"
//     }),
//     motherOccupation: Joi.string().required().messages({
//         'string.empty': "Mother's Occupation is Required!"
//     }),
//     motherContactNo: Joi.string().required().messages({
//         'string.empty': "Mother's Contact Number is Required!"
//     })
// });

// // LocalGuardians Validationschema
// const localGuardiansValidationSchema = Joi.object({
//     name: Joi.string().required().messages({
//         'string.empty': "Local Guardian's Name is Required!"
//     }),
//     occupation: Joi.string().required().messages({
//         'string.empty': "Local Guardian's Occupation is Required!"
//     }),
//     contactNumber: Joi.string().required().messages({
//         'string.empty': "Local Guardian's Contact Number is Required!"
//     }),
//     address: Joi.string().required().messages({
//         'string.empty': "Local Guardian's Address is Required!"
//     })
// });

// // Student schema
// const studentValidationSchema = Joi.object({
//     id: Joi.string().trim().required().messages({
//         'string.empty': "Student ID is Required!"
//     }),
//     name: userNameValidationSchema.required().messages({
//         'any.required': "Student's Name is Required!"
//     }),
//     gender: Joi.string()
//         .trim()
//         .valid('male', 'female', 'other')
//         .required()
//         .messages({
//             'string.empty': 'Gender is Required!',
//             'any.only': 'Gender must be either male, female, or other'
//         }),
//     dateOfBirth: Joi.string().optional(),
//     email: Joi.string()
//         .trim()
//         .required()
//         .email()
//         .messages({
//             'string.empty': 'Email is Required!',
//             'string.email': '{#value} is not a valid email'
//         }),
//     contactNo: Joi.string().trim().required().messages({
//         'string.empty': 'Contact Number is Required!'
//     }),
//     emergencyContactNo: Joi.string().trim().required().messages({
//         'string.empty': 'Emergency Contact Number is Required!'
//     }),
//     bloodGroup: Joi.string()
//         .trim()
//         .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
//         .messages({
//             'any.only': "Blood Group must be one of 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'"
//         }),
//     presentAddress: Joi.string().required().messages({
//         'string.empty': 'Present Address is Required!'
//     }),
//     permanentAddress: Joi.string().required().messages({
//         'string.empty': 'Permanent Address is Required!'
//     }),
//     guardians: guardiansValidationSchema.required().messages({
//         'any.required': 'Guardians Information is Required!'
//     }),
//     localGuardians: localGuardiansValidationSchema.required().messages({
//         'any.required': 'Local Guardians Information is Required!'
//     }),
//     // profileImage: Joi.string().trim().optional(),
//     isActive: Joi.string()
//         .trim()
//         .valid('Active', 'Inactive')
//         .default('Active')
// });

// export default studentValidationSchema;
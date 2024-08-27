import Joi from "joi";
import { ISignUpLoginSchema,IUser } from "@src/interfaces";
import { required_String_NotEmpty } from "@src/validation_schema/commonFields"

const name = required_String_NotEmpty('name')

const phoneNumber = Joi.string()
  .length(10)
  .pattern(/[6-9]{1}[0-9]{9}/)
  .messages({
    "string.empty": "Phone number cannot be empty.",
    "string.length": "Phone number must be exactly 10 digits long.",
    "string.pattern.base": "Phone number is invalid.",
  })


const otp = Joi.string().length(4).required().messages({
  'any.required': "otp is required",
  'string.base': 'otp must be a string',
  'string.empty': `otp can't be empty`,
  'string.length': `OTP must be 4 digits`,
})


const otpID = Joi.string().required().messages({
  'any.required': "otpId is required",
  'string.base': 'otpID must be a string'
})

const valiateImage = Joi.object({
  data: required_String_NotEmpty('data'),
  contentType: Joi.string().valid(
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
    'image/svg+xml',
    'image/tiff',
    'image/x-icon'
  ).required()
}).optional();


// Schema for sign-up validation
const validateSignUpOrLogin = Joi.object({
  name,
  phoneNumber,
})


const validateSendOtp = Joi.object({
  phoneNumber,
})


const validateVerifyOtp = Joi.object({
  phoneNumber,
  otp,
  otpID
})


export const OtpSendValidator: Joi.ObjectSchema<ISignUpLoginSchema> = validateSendOtp;
export const VerifyOtpValidator: Joi.ObjectSchema<ISignUpLoginSchema> = validateVerifyOtp;
export const imageValidator: Joi.ObjectSchema<IUser> = valiateImage;
export const signUpAndLoginValidator: Joi.ObjectSchema<ISignUpLoginSchema> = validateSignUpOrLogin;

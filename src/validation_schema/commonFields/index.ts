import Joi from "joi"
function required_String_NotEmpty(fieldName: string) {
    return Joi.string().required().messages({
        'any.required': `${fieldName} is required`,
        'string.base': `${fieldName} must be a string`,
        'string.empty': `${fieldName} can't be empty`,
    });
}

export { required_String_NotEmpty }
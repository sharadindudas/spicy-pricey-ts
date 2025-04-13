import * as yup from "yup";
import validator from "validator";

export const emailSchema = yup
    .string()
    .required("Please provide an email address")
    .trim()
    .test("validate-email", "Please provide a valid email address", (value) =>
        validator.isEmail(value)
    );

export const phoneSchema = yup
    .string()
    .required("Please provide a phone number")
    .trim()
    .test("validate-phone", "Please provide a valid phone number", (value) =>
        validator.isMobilePhone(value, "any", { strictMode: false })
    );

export const passwordSchema = yup
    .string()
    .required("Please provide a password")
    .trim()
    .test(
        "validate-password",
        "Password must be at least 8 characters long and includes at least one uppercase character, one lowercase character, one number and one symbol",
        (value) =>
            validator.isStrongPassword(value, {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            })
    );

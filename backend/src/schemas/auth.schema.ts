import * as yup from "yup";
import { emailSchema, phoneSchema, passwordSchema } from "./common.schema";
import validator from "validator";

// Signup schema
export const SignupSchema = yup.object({
    name: yup
        .string()
        .trim()
        .required("Please provide a name")
        .min(6, "Name must be at least 6 characters")
        .max(50, "Name must not exceed 50 characters"),
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema
});
export type SignupSchemaType = yup.InferType<typeof SignupSchema>;

// Login schema
export const LoginSchema = yup.object({
    identity: yup
        .string()
        .required("Please provide an email address or phone number")
        .trim()
        .test("validate-email-phone", "Please provide a valid email address or phone nunber", (value) => {
            return validator.isEmail(value) || validator.isMobilePhone(value, "any", { strictMode: false });
        }),
    password: passwordSchema
});
export type LoginSchemaType = yup.InferType<typeof LoginSchema>;

import * as yup from "yup";
import validator from "validator";
import { passwordSchema } from "./common";

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

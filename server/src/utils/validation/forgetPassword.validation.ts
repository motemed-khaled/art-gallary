import { check } from "express-validator";

import { validationMiddleware } from "../../middleWares/validation.middleware";
import { request } from "express";



export const forgetPasswordValidation = [
    check("email").isEmail().withMessage("invalid email format"),
    validationMiddleware
];

export const verifyResetCodeValidation = [
    check("resetCode").notEmpty().withMessage("reset code required")
    .isLength({min:6}).withMessage("reset code must be 6 digits"),
    validationMiddleware
];

export const resetPasswordValidation = [
    check("email").isEmail().withMessage("invalid email format"),
    check("password").notEmpty().withMessage("new password required"),
    check("confirmPassword").custom((val: string, { req }) => {
        if (val != req.body.password) {
            throw new Error("incorrect confirm password");
        } else {
            return true;
        }
    }),
    validationMiddleware
];
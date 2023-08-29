import { check } from "express-validator";

import { validationMiddleware } from "../../middleWares/validation.middleware";


export const signUpValidation = [
    check("name").notEmpty()
        .withMessage("name is required..."),
    check("email").notEmpty()
        .withMessage("email is required")
        .isEmail().withMessage("invalid email format"),
    check("phone").isMobilePhone(["ar-EG", "ar-SA"])
        .withMessage("invalid phone number only eg and ksa numbers"),
    check("address").notEmpty()
        .withMessage("user address required"),
    check("password").notEmpty()
        .withMessage("password required"),
    validationMiddleware
];

export const loginValidation = [
    check("email").notEmpty()
        .withMessage("email is required")
        .isEmail().withMessage("invalid email format"),
    check("password").notEmpty()
        .withMessage("password required"),
    validationMiddleware
];
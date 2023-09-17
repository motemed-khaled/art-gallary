import { check } from "express-validator";
import { Request } from 'express';

import { validationMiddleware } from "../../middleWares/validation.middleware";



export const createUserValidation = [
    check("name").notEmpty()
        .withMessage("name is required..."),
    check("email").notEmpty()
        .withMessage("email is required")
        .isEmail().withMessage("invalid email format"),
    check("phone").isMobilePhone(["ar-EG", "ar-SA"])
        .withMessage("invalid phone number only eg and ksa numbers"),
    check("userImg").optional().notEmpty()
        .withMessage("userImg required"),
    check("address").notEmpty()
        .withMessage("user address required"),
    check("role").optional(),
    validationMiddleware
];

export const getUserValidation = [
    check("id").isMongoId()
        .withMessage("invalid id format"),
    validationMiddleware
];

export const deleteUserValidation = [
    check("id").isMongoId()
        .withMessage("invalid id format"),
    validationMiddleware
];

export const updateUservalidation = [
    check("id").isMongoId()
        .withMessage("invalid id format"),
    check("name").optional().notEmpty()
        .withMessage("name is required..."),
    check("email").optional().notEmpty()
        .withMessage("email is required")
        .isEmail().withMessage("invalid email format"),
    check("phone").optional().isMobilePhone(["ar-EG", "ar-SA"])
        .withMessage("invalid phone number only eg and ksa numbers"),
    check("address").optional().notEmpty()
        .withMessage("user address required"),
    check("role").optional(),
    validationMiddleware
];

export const updateUserPasswordValidation = [
    check("id").isMongoId()
        .withMessage("invalid id format"),
    check("password").notEmpty()
        .withMessage("password required"),
    check("confirmPassword").custom((val: string, { req }) => {
        if (val != req.body.password) {
            throw new Error("Passord Confirmation incorrect")
        } else {
            return true
        }
    }),
    validationMiddleware
];

export const updateLoggedUservalidation = [
    check("name").optional().notEmpty()
        .withMessage("name is required..."),
    check("email").optional().notEmpty()
        .withMessage("email is required")
        .isEmail().withMessage("invalid email format"),
    check("phone").optional().isMobilePhone(["ar-EG", "ar-SA"])
        .withMessage("invalid phone number only eg and ksa numbers"),
    check("address").optional().notEmpty()
        .withMessage("user address required"),
    validationMiddleware
];

export const updateLoggedUserPasswordValidation = [
    check("newPassword").notEmpty()
        .withMessage("password required"),
    check("confirmPassword").custom((val: string, { req }) => {
        if (val != req.body.newPassword) {
            throw new Error("new password Confirmation incorrect")
        } else {
            return true
        }
    }),
    validationMiddleware
];


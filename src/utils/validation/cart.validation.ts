import { check } from "express-validator";

import { validationMiddleware } from "../../middleWares/validation.middleware";


export const createCartValidation = [
    check("productId").isMongoId()
        .withMessage("invalid id format"),
    validationMiddleware
];

export const deleteSpecificItemValidation = [
    check("id").isMongoId()
        .withMessage("invalid id format"),
    validationMiddleware
];

export const updateUserQuantityValidation = [
    check("id").isMongoId()
        .withMessage("invalid id format"),
    check("quantity").isNumeric()
        .withMessage("quantity must be a nubmer"),
    validationMiddleware
];
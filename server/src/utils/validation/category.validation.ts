import { check } from "express-validator";

import { validationMiddleware } from "../../middleWares/validation.middleware";


export const createCategoryValidation = [
    check("name").notEmpty()
        .withMessage("category name required")
        .isLength({ min: 4 }).withMessage("to short category name")
        .isLength({ max: 18 }).withMessage("to long category name"),
    validationMiddleware
];

export const getCategoryValidation = [
    check("id").isMongoId().withMessage("invalid id format"),
    validationMiddleware
];

export const deleteCategoryValidation = [
    check("id").isMongoId().withMessage("invalid id format"),
    validationMiddleware
];

export const updateCategoryValidation = [
    check("name").optional().notEmpty()
        .withMessage("category name required")
        .isLength({ min: 4 }).withMessage("to short category name")
        .isLength({ max: 18 }).withMessage("to long category name"),
    validationMiddleware
];


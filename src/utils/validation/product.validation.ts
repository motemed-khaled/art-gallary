import { check } from "express-validator";

import { validationMiddleware } from "../../middleWares/validation.middleware";
import { categoryModel } from "../../models/category.model";

export const createProductValidation = [
    check("name").notEmpty()
        .withMessage("product name required")
        .isLength({ min: 4 }).withMessage("very short name")
        .isLength({ max: 30}).withMessage("very long name"),
    check("description").notEmpty()
        .withMessage("description is required")
        .isLength({ min: 50 }).withMessage("very short dexcription")
        .isLength({ max: 300 }).withMessage("very long dexcription"),
    check("price").notEmpty()
        .withMessage("price is required")
        .isNumeric().withMessage("price must be a number"),
    check("stock").notEmpty()
        .withMessage("stock is required")
        .isNumeric().withMessage("stock must be a number"),
    check("image").notEmpty()
        .withMessage("image required"),
    check("category").isMongoId()
        .withMessage("invalid id format")
        .custom((val: string) => {
            return categoryModel.findById(val).then(cat => {
                if (!cat) {
                    throw new Error("no category for this id");
                } else {
                    return true;
                }
            })
        }),
    validationMiddleware
];

export const updateProductValidation = [
    check("id").isMongoId()
    .withMessage("invalid id format"),
    check("name").optional().notEmpty()
        .withMessage("product name required")
        .isLength({ min: 4 }).withMessage("very short name")
        .isLength({ max: 30 }).withMessage("very long name"),
    check("description").optional().notEmpty()
        .withMessage("description is required")
        .isLength({ min: 50 }).withMessage("very short dexcription")
        .isLength({ max:300}).withMessage("very long dexcription"),
    check("price").optional().notEmpty()
        .withMessage("price is required")
        .isNumeric().withMessage("price must be a number"),
    check("stock").optional().notEmpty()
        .withMessage("stock is required")
        .isNumeric().withMessage("stock must be a number"),
    check("image").optional().notEmpty()
        .withMessage("image required"),
    check("category").optional().isMongoId()
        .withMessage("invalid id format")
        .custom((val: string) => {
            return categoryModel.findById(val).then(cat => {
                if (!cat) {
                    throw new Error("no category for this id");
                } else {
                    return true;
                }
            })
        }),
    validationMiddleware
];

export const deleteProductValidation = [
    check("id").isMongoId()
        .withMessage("invalid id format"),
    validationMiddleware
];

export const getProductValidation = [
    check("id").isMongoId()
        .withMessage("invalid id format"),
    validationMiddleware
];

export const updateViewValidation = [
    check("id").isMongoId()
        .withMessage("invalid id format"),
    validationMiddleware
];
import { check } from "express-validator";
import { Request } from 'express';

import { productModel } from "../../models/product.model";
import { validationMiddleware } from "../../middleWares/validation.middleware";
import { error } from "console";

export const addProductToWhishListValidation = [
    check("productId").isMongoId()
        .withMessage("invalid id format")
        .custom((val: string, { req }) => {
            return productModel.findById(val).then(product => {
                if (!product) {
                    throw new Error("no product in this id");
                } else {
                    return true;
                }
            })
        }),
    validationMiddleware
];

export const deleteProductFromWhishListValidation = [
    check("productId").isMongoId()
        .withMessage("invalid id format"),
    validationMiddleware
];
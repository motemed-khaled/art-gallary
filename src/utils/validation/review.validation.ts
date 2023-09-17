import { check } from "express-validator";
import { Request } from 'express';

import { validationMiddleware } from "../../middleWares/validation.middleware";
import { reviewModel } from "../../models/review.model";


export const createReviewValidation = [
    check("title").optional().notEmpty()
        .withMessage("review comment required"),
    check("rating").optional()
        .notEmpty().withMessage("rating required")
        .isFloat({ min: 1, max: 5 }).withMessage("rating value must be between 1.0 and 5.0"),
    check("product").isMongoId()
        .withMessage("invalid id format")
        .custom((val: string, { req }) =>
            reviewModel.findOne({ user: req.user._id, product: req.body.product }).then(doc => {
                
                if (doc) {
                    return Promise.reject(new Error("you already have areview for this product"))
                }
                return true;
            })
        ).custom((val: string, { req }) => 
            req.body.user = req.user._id
        ),
    validationMiddleware
];

export const updateReviewValidation = [
    check("id").isMongoId()
        .withMessage("invalid id foemat")
        .custom((val, { req }) =>
            reviewModel.findOne({_id:val}).then(doc => {
                if (!doc) {
                    return Promise.reject(new Error("no review in this id"));
                }
                
                if (doc.user.toString() != req.user._id.toString()) {
                    return Promise.reject(new Error("you not owner for this review"));
                }
            })
        ),
    check("title").optional().notEmpty()
        .withMessage("review comment required"),
    check("rating").optional()
        .notEmpty().withMessage("rating required")
        .isFloat({ min: 1, max: 5 }).withMessage("rating value must be between 1.0 and 5.0"),
    validationMiddleware
];

export const deleteReviewValidation = [
    check("id").isMongoId()
        .withMessage("invalid id format")
        .custom((val: string, { req }) => {
            if (req.user.role === "user") {
                return reviewModel.findOne({_id:val}).then(doc => {
                    if (!doc) {
                        return Promise.reject(new Error("no review in this id"));
                    }
                    if (doc.user.toString() != req.user._id.toString()) {
                        return Promise.reject(new Error("you not owner for this review"));
                    }
                })
            }
            return true;
        }),
    validationMiddleware
];

export const getReviewValidation = [
    check("id").isMongoId().withMessage("invalid id format"),
    validationMiddleware
];
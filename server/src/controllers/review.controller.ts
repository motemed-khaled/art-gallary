import {  Response , NextFunction } from "express";

import { reviewModel } from "../models/review.model";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./handlers.controller";
import { ExpressReq } from "../types/expressReq.interface";



export const createReviewMiddleWare = (req: ExpressReq, res: Response, next: NextFunction) => {
    if (req.params.productId) {
        req.body.product = req.params.productId
    }
    next();
};

export const getAllReviewMiddleWare = (req: ExpressReq, res: Response, next: NextFunction) => {
    let filterObj = {};
    if (req.params.productId) {
        filterObj = {product:req.params.productId}
    }
    req.filterObj = filterObj;
    next();
};

export const createReview = createOne(reviewModel);

export const getReviews = getAll(reviewModel);

export const getReview = getOne(reviewModel);

export const updateReview = updateOne(reviewModel);

export const deleteReview = deleteOne(reviewModel);
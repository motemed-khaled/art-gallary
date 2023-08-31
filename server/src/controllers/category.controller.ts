import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";

import { ApiError } from "../utils/apiError";
import { categoryModel } from "../models/category.model";
import { ExpressReq } from "../types/expressReq.interface";


export const createCategory = asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
    const category = await categoryModel.create(req.body);
    res.status(201).json({ status: "success", data: category });
});

export const getCategories = asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
    const categories = await categoryModel.find();
    res.status(200).json({ status: "success", data: categories });
});

export const getCategory = asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
    const category = await categoryModel.findById(req.params.id);

    if (!category) {
        next(new ApiError(`no category for this id : ${req.params.id}`, 404));
        return;
    }
    res.status(200).json({ status: "success", data: category });
});

export const updateCategory = asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
    const category = await categoryModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    );

    if (!category) {
        next(new ApiError(`no category for this id : ${req.params.id}`, 404));
        return;
    }
    res.status(200).json({ status: "success", data: category });
});

export const deleteCategory = asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
    const category = await categoryModel.findByIdAndDelete(req.params.id);

    if (!category) {
        next(new ApiError(`no category for this id : ${req.params.id}`, 404));
        return;
    }
    res.status(204).send();
});
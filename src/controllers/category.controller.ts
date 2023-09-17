import { NextFunction, Response } from "express";
import asyncHandler from "express-async-handler";

import { categoryModel } from "../models/category.model";
import { ExpressReq } from "../types/expressReq.interface";
import { deleteOne , getOne , updateOne , createOne , getAll } from "./handlers.controller";


export const createCategory = createOne(categoryModel);

export const getCategories =  asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
    const catogry = await categoryModel.find();

    res.status(200).json({ status:"success" , data:catogry });
});

export const getCategory = getOne(categoryModel);

export const updateCategory = updateOne(categoryModel);

export const deleteCategory = deleteOne(categoryModel);
    
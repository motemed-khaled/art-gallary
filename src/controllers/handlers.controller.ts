import { NextFunction, Response } from "express";
import asyncHandler from "express-async-handler";
import { Model } from "mongoose";

import { categoryModel } from "../models/category.model";
import { ExpressReq } from "../types/expressReq.interface";
import { ApiError } from "../utils/apiError";
import { Api_Feature } from "../utils/apiFeature";
import { userModel } from "../models/user.model";
import { normalizeUser } from "../utils/dto/user.dto";


export const deleteOne =(modelName:Model< any >)=> asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
    const document = await modelName.findByIdAndDelete(req.params.id);

    if (!document) {
        next(new ApiError(`no category for this id : ${req.params.id}`, 404));
        return;
    }
    res.status(204).send();
});

export const getOne=(modelName:Model< any > ,populationOpt?:string)=> asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
    
    // build query
    let query =  modelName.findById(req.params.id);
    if (populationOpt) {
        query.populate(populationOpt)
    }
    
    const document = await query;

    if (!document) {
        next(new ApiError(`no document for this id : ${req.params.id}`, 404));
        return;
    }

    if (modelName === userModel) {
        res.status(200).json({ status: "success", data: normalizeUser(document) });
        return;
    }
    res.status(200).json({ status: "success", data: document });
});

export const updateOne =(modelName:Model< any >)=> asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
    const document = await modelName.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    );

    if (!document) {
        next(new ApiError(`no category for this id : ${req.params.id}`, 404));
        return;
    }
    res.status(200).json({ status: "success", data: document });
});

export const createOne = (modelName:Model< any >)=> asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
    const document = await modelName.create(req.body);
    res.status(201).json({ status: "success", data: document });
});

export const getAll = (modelName:Model< any >)=> asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
    let filterObj = {};
    if (req.filterObj) {
        filterObj = req.filterObj;
    }
    
    const documentCount = await modelName.countDocuments();

    const apiFeature = new Api_Feature(modelName.find(filterObj), req.query)
        .filter().sort().limitFields().search().pagination(documentCount);
    
    const { mongooseQuery, paginateResult } = apiFeature;
    const document = await mongooseQuery;

    res.status(200).json({ result: document.length, paginateResult, data: document });
});




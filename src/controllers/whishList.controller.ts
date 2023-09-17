import {  Response , NextFunction } from "express";

import { userModel } from "../models/user.model";
import { ExpressReq } from "../types/expressReq.interface";
import  asyncHandler  from 'express-async-handler';
import { ApiError } from "../utils/apiError";
import { normalizeUser } from "../utils/dto/user.dto";

export const addToWhishList = asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
    const userWhishList = await userModel.findByIdAndUpdate(
        req.user.id,
        { $push: { wishList: { product: req.body.productId } } },
        { new: true }
    ).populate({
        path: 'wishList.product'
    });

    if (!userWhishList) {
        next(new ApiError("No User in this id", 404));
        return;
    }

    res.status(201).json({ status: "success", data: normalizeUser(userWhishList) });
});

export const deleteFromUserWhishList = asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
    const userWhishList = await userModel.findByIdAndUpdate(
        req.user._id,
        { $pull: { wishList: { product: req.params.productId } } },
        {new:true}
        ).populate({
            path: 'wishList.product'
        });

    if (!userWhishList) {
        next(new ApiError("no user in this id", 404));
        return;
    }

    res.status(200).json({ status: "success", data: normalizeUser(userWhishList) });
});
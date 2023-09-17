import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import bcryptjs from "bcryptjs";


import { userModel } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { normalizeUser } from "../utils/dto/user.dto";
import { ExpressReq } from "../types/expressReq.interface";


export const getLoggedUser = asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
    req.params.id = req.user?.id;
    next();
});

export const updateLoggedUser=asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
    const user = await userModel.findByIdAndUpdate(
        req.user?.id,
        {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            userImg:req.body.userImg
        },
        {
            new: true
        }
    );

    if (!user) {
        next(new ApiError("no user in this id", 404));
        return;
    }
    res.status(200).json({ status: "success", data: normalizeUser(user) });
});

export const updateLogedUserPassword = asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
   
    const user = await userModel.findById(req.user.id).select("+password");;

    if (!user || !(await user.validatePassword(req.body.oldpassword))) {
        next(new ApiError("invalid creditional", 401));
        return;
    }
    
    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({ status: "success", data: normalizeUser(user) });
});

export const deleteLoggedUser = asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
    req.params.id = req.user?.id;
    next();
});
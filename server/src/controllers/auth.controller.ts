import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { ApiError } from "../utils/apiError";
import { userModel } from "../models/user.model";
import { generateToken } from "../utils/generateToken";
import { normalizeUser } from "../utils/dto/user.dto";
import { ExpressReq } from "../types/expressReq.interface";



export const signUp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
    const user = await userModel.create({
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        password: req.body.password
    });
    const token = generateToken({ userId: user._id });

    res.status(201).json({ status: "success", data: normalizeUser(user), token: token });
});

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
    const user = await userModel.findOne({ email: req.body.email });
    
    if (!user || !(await user.validatePassword(req.body.password))) {
        next(new ApiError("invalid creditional", 401));
        return;
    }

    const token = generateToken({ userId: user._id });

    res.status(200).json({ status: "success", data: normalizeUser(user), token: token });
});

export const auth = asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        next(new ApiError("un authenticated", 401));
        return;
    }

    const decode = await jwt.verify(token, process.env.JWT_SECRET!) as {userId:string , iat:number};
    
    const logedUser = await userModel.findById(decode.userId);
    if (!logedUser) {
        next(new ApiError("this user dosent exist", 404));
        return;
    }

    if (logedUser.changePasswordTime) {
        const changeTime: number = logedUser.changePasswordTime.getTime() / 1000;
       if (changeTime > decode.iat) {
           next(new ApiError("user change password please login again", 401));
           return;
       }
    }
    req.user = logedUser;
    next();
});

export const allowedTo = (...roles: string[]) => asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role!)) {
        next(new ApiError("you not allowed access this route", 403));
        return;
    }
    next();
})
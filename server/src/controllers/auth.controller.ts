import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";

import { ApiError } from "../utils/apiError";
import { userModel } from "../models/user.model";
import { generateToken } from "../utils/generateToken";
import { normalizeUser } from "../utils/dto/user.dto";



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
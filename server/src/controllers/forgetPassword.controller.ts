import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

import { userModel } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { sendEmail } from "../utils/sendEmail";


export const forgetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
        next(new ApiError(`No user in this email`, 404));
        return;
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeHash = crypto.createHash("sha256").update(resetCode).digest("hex");
    user.resetPasswordCode = resetCodeHash;
    user.resetCodeExpire = Date.now() + 5 * 60 * 1000;
    user.resetCodeVerify = false;
    await user.save();
    try {
        const message = `Hi ${user.name} \n 
        we recieved a request to reset the password on your E-commercy account \n
        ${resetCode} \n enter this code to reset password
        `;
        await sendEmail({
            email: user.email,
            subject: "your password reset code valid for 5 min",
            message: message
        });
    } catch (error) {
        user.resetPasswordCode = undefined;
        user.resetCodeExpire = undefined;
        user.resetCodeVerify = undefined;

        await user.save();
        next(new ApiError("we have an error to sending email please try again later", 500));
        return;
    }

    res.status(200).json({ status: "success", message: "reset code sent to your email" });
});


export const verifyResetCode = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const hashResetCode = crypto.createHash("sha256").update(req.body.resetCode).digest("hex");
    const user = await userModel.findOne({
        resetPasswordCode: hashResetCode,
        resetCodeExpire: { $gt: Date.now() }
    });

    if (!user) {
        next(new ApiError("invalid reset code or expire", 500));
        return;
    }

    user.resetCodeVerify = true;
    await user.save();
    res.status(200).json({ status: "success" });
});

export const changePassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const user = await userModel.findOne({ email: req.body.email });

    if (!user) {
        next(new ApiError("no user in this email", 404));
        return;
    }

    if (!user.resetCodeVerify) {
        next(new ApiError("reset code not verifed", 400));
        return;
    }

    user.password = req.body.password;
    user.resetCodeExpire = undefined;
    user.resetCodeVerify = undefined;
    user.resetPasswordCode = undefined;
    await user.save();
    
    res.status(200).json({ status: "success" });
});
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { ApiError } from "../utils/apiError";
import { userModel } from "../models/user.model";
import { generateToken } from "../utils/generateToken";
import { normalizeUser } from "../utils/dto/user.dto";
import { ExpressReq } from "../types/expressReq.interface";
import { sendEmail } from "../utils/sendEmail";

export const signUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

    const currentUser = await userModel.findOne({ email: req.body.email });
    if (currentUser) {
      if (!currentUser.signUpVerify) {
        resendVerifySignUp(req, res, next);
        return;
      } else {
        next(new ApiError("you already have an account please try to login.. ", 400));
        return;
      }
    }

    const user = await userModel.create({
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      phone: req.body.phone,
      password: req.body.password,
    });

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeHash = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    user.signUpResetCode = resetCodeHash;
    user.signUpResetCodeExpire = Date.now() * 10 * 60 * 1000;
    await user.save();

    try {
      const message = `Hi ${user.name} \n 
    we recieved a request to signUp in Art-Gallary please use the verifyCode to verify your self : \n
    ${resetCode} \n enter this code to signUp
    `;
      await sendEmail({
        email: user.email,
        subject: "your signUp code valid for 5 min",
        message: message,
      });
    } catch (error) {
      user.signUpResetCode = undefined;
      user.signUpResetCodeExpire = undefined;
      await user.save();
      next(
        new ApiError(
          "we have an error to sending email please try again later",
          500
        )
      );
      return;
    }

    res
      .status(200)
      .json({ status: "success", message: "code sent in your email" });
  }
);

export const verifySignUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const hashCode = crypto
      .createHash("sha256")
      .update(req.body.resetCode)
      .digest("hex");

    const user = await userModel.findOne({
      signUpResetCode: hashCode,
      signUpResetCodeExpire: { $gt: Date.now() },
    });

    if (!user) {
      next(new ApiError("invalid reset code or expire", 500));
      return;
    }

    user.signUpVerify = true;
    user.signUpResetCodeExpire = undefined;
    user.signUpResetCode = undefined;
    await user.save();

    const token = generateToken({ userId: user._id });

    res
      .status(201)
      .json({ status: "success", data: normalizeUser(user), token: token });
  }
);

export const resendVerifySignUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email: email });

    if (!user) {
      next(new ApiError("no user in this email", 404));
      return;
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeHash = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    user.signUpResetCode = resetCodeHash;
    user.signUpResetCodeExpire = Date.now() * 10 * 60 * 1000;
    user.signUpVerify = false;
    await user.save();

    try {
      const message = `Hi ${user.name} \n 
    we recieved a request to signUp in Art-Gallary please use the verifyCode to verify your self : \n
    ${resetCode} \n enter this code to signUp
    `;
      await sendEmail({
        email: user.email,
        subject: "your signUp code valid for 5 min",
        message: message,
      });
    } catch (error) {
      user.signUpResetCode = undefined;
      user.signUpResetCodeExpire = undefined;
      await user.save();

      next(
        new ApiError(
          "we have an error to sending email please try again later",
          500
        )
      );
      return;
    }

    res
      .status(200)
      .json({ status: "success", message: "code sent in your email please check it now !" });
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userModel
      .findOne({ email: req.body.email })
      .select("+password").populate("wishList.product");

    if (!user || !(await user.validatePassword(req.body.password))) {
      next(new ApiError("invalid creditional", 401));
      return;
    }

    if (!user.signUpVerify) {
      next(new ApiError("please verify your self first", 401));
      return;
    }

    const token = generateToken({ userId: user._id });

    res
      .status(200)
      .json({ status: "success", data: normalizeUser(user), token: token });
  }
);

export const auth = asyncHandler(
  async (req: ExpressReq, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      next(new ApiError("un authenticated", 401));
      return;
    }

    const decode = (await jwt.verify(token, process.env.JWT_SECRET!)) as {
      userId: string;
      iat: number;
    };

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

    if (!logedUser.signUpVerify) {
      next(new ApiError("please verify your self first", 401));
      return;
    }

    req.user = logedUser;
    next();
  }
);

export const allowedTo = (...roles: string[]) =>
  asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role!)) {
      next(new ApiError("you not allowed access this route", 403));
      return;
    }
    next();
  });

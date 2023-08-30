import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import bcryptjs from "bcryptjs";
import multer from "multer";
import sharp from "sharp";
import { uid } from "uid";

import { userModel } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { normalizeUser } from "../utils/dto/user.dto";
import { ExpressReq } from "../types/expressReq.interface";
import { uploadImage } from "../middleWares/uploadImg.middleware";


export const uploadImg = uploadImage("userImg");

export const userImgProccessing = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
      const fileName = `user-${uid()}-${Date.now()}.jpeg`;
      await sharp(req.file.buffer)
        .resize(200, 200)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
            .toFile(`src/uploads/users/${fileName}`);
        req.body.userImg = fileName
        }
        next();
  }
);

export const createUser = asyncHandler(
  async (req: ExpressReq, res: Response, next: NextFunction) => {
    if (req.body.role === "admin" && req.user?.role === "admin") {
      next(new ApiError("only superAdmin can create admin user", 401));
      return;
    }
    const user = await userModel.create(req.body);
    res.status(201).json({ status: "success", data: normalizeUser(user) });
  }
);

export const getUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await userModel.find();
    res.status(200).json({ status: "success", data: users });
  }
);

export const getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      next(new ApiError(`no user in this id :${req.params.id}`, 404));
      return;
    }
    res.status(200).json({ status: "success", data: normalizeUser(user) });
  }
);

export const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        role: req.body.role,
      },
      { new: true }
    );

    if (!user) {
      next(new ApiError(`no user in this id :${req.params.id}`, 404));
      return;
    }
    res.status(200).json({ status: "success", data: normalizeUser(user) });
  }
);

export const updateUserPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        password: await bcryptjs.hash(req.body.password, 12),
        changePasswordTime: Date.now(),
      },
      { new: true }
    );

    if (!user) {
      next(new ApiError(`no user in this id :${req.params.id}`, 404));
      return;
    }
    res.status(200).json({ status: "success", data: normalizeUser(user) });
  }
);

export const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) {
      next(new ApiError(`no user in this id :${req.params.id}`, 404));
      return;
    }
    res.status(204).send();
  }
);

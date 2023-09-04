import sharp from "sharp";
import { uid } from "uid";
import { NextFunction, Response, Request } from "express";
import asyncHandler from "express-async-handler";


import { productModel } from "../models/product.model";
import { deleteOne, getOne, updateOne, createOne, getAll } from "./handlers.controller";
import { uploadImage } from "../middleWares/uploadImg.middleware";
import { ExpressReq } from "../types/expressReq.interface";
import { userModel } from "../models/user.model";
import { sendEmail } from "../utils/sendEmail";

export const uploadImg = uploadImage("image");

export const productImageProcceing = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
      const fileName = `product-${uid()}-${Date.now()}.jpeg`;
      await sharp(req.file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
            .toFile(`src/uploads/product/${fileName}`);
        req.body.image = fileName
        }
        next();
  }
);

export const createProduct =  asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
  
  const document = await productModel.create(req.body);
  
    const users = await userModel.find();

    const emailPromises = users.map(user => {
      const message = `Hi ${user.name} \n 
      we recently added a new product : ${document.name} lets discover it .
      `;
      const mailOptions = {
        email: user.email,
        subject: "notification from Art-Gallary",
        message: message
      };

      return sendEmail(mailOptions);
    });
  
  await Promise.all(emailPromises);
  res.status(201).json({ status: "success", data: document });
});

export const getProducts = getAll(productModel);

export const getProduct = getOne(productModel , "reviews");

export const updateProduct = updateOne(productModel);

export const deleteProduct = deleteOne(productModel);
import sharp from "sharp";
import { uid } from "uid";
import { NextFunction, Response, Request } from "express";
import asyncHandler from "express-async-handler";


import { productModel } from "../models/product.model";
import { deleteOne, getOne, updateOne, createOne, getAll } from "./handlers.controller";
import { uploadImage } from "../middleWares/uploadImg.middleware";

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

export const createProduct = createOne(productModel);

export const getProducts = getAll(productModel);

export const getProduct = getOne(productModel , "reviews");

export const updateProduct = updateOne(productModel);

export const deleteProduct = deleteOne(productModel);
import multer from "multer";
import { Request } from "express";

import { ApiError } from "../utils/apiError";

const multerOption = () => {
  const multerStorage = multer.memoryStorage();
  const multerFilter = function (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("suported only image" , 400) as null, false);
    }
  };

  const uploads = multer({ storage: multerStorage, fileFilter: multerFilter });
  return uploads;
};

export const uploadImage = (fieldName: string) => {
    return multerOption().single(fieldName);
};

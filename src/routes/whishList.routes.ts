import express from "express";

import { auth as protect , allowedTo } from "../controllers/auth.controller";
import { addToWhishList, deleteFromUserWhishList } from "../controllers/whishList.controller";
import { addProductToWhishListValidation, deleteProductFromWhishListValidation } from "../utils/validation/whishList.validation";


export const router = express.Router();

router.use(protect, allowedTo("user"));

router.post("/",addProductToWhishListValidation, addToWhishList)
router.delete("/:productId",deleteProductFromWhishListValidation, deleteFromUserWhishList);
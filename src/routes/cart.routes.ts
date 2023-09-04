import express from "express";

import {
  addProductToCart,
  deleteSpecificCart,
  deleteUserCart,
  getLoggedUserCart,
  updateUserCartQuantity,
} from "../controllers/cart.controller";
import {
  createCartValidation,
  deleteSpecificItemValidation,
  updateUserQuantityValidation,
} from "../utils/validation/cart.validation";
import { auth as protect, allowedTo } from "../controllers/auth.controller";


export const router = express.Router();

router.use(protect, allowedTo("user"));

router
    .route("/").post(createCartValidation, addProductToCart)
    .get(getLoggedUserCart)
    .delete(deleteUserCart);

router
    .route("/:id")
    .delete(deleteSpecificItemValidation, deleteSpecificCart)
    .patch(updateUserQuantityValidation, updateUserCartQuantity);

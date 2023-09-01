import express from "express";

import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
  productImageProcceing,
  uploadImg,
} from "../controllers/product.controller";
import {
  createProductValidation,
  deleteProductValidation,
  getProductValidation,
  updateProductValidation,
} from "../utils/validation/product.validation";
import { auth as protect, allowedTo } from "../controllers/auth.controller";
import { router as reviewRoutes } from "./review.routes";

export const router = express.Router();

router.use("/:productId/review", reviewRoutes);

router.use(protect);

router.get("/", getProducts);
router.get("/:id", getProductValidation, getProduct);

router.use(allowedTo("admin", "superAdmin"));
router.post("/", uploadImg, productImageProcceing, createProductValidation, createProduct);
router
    .route("/:id")
    .patch(uploadImg, productImageProcceing, updateProductValidation, updateProduct)
    .delete(deleteProductValidation, deleteProduct);

import express from "express";

import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/category.controller";
import {
  createCategoryValidation,
  deleteCategoryValidation,
  getCategoryValidation,
  updateCategoryValidation,
} from "../utils/validation/category.validation";
import { auth as protect, allowedTo } from "../controllers/auth.controller";

export const router = express.Router();



router.get("/", getCategories);
router.get("/:id", getCategoryValidation, getCategory);

router.use(protect, allowedTo("admin", "superAdmin"));

router.post("/", createCategoryValidation, createCategory);
router
  .route("/:id")
  .patch(updateCategoryValidation, updateCategory)
  .delete(deleteCategoryValidation, deleteCategory);

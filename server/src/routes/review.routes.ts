import express from "express";

import {
  createReview,
  createReviewMiddleWare,
  deleteReview,
  getReview,
  getAllReviewMiddleWare,
  getReviews,
  updateReview,
} from "../controllers/review.controller";
import {
  createReviewValidation,
  deleteReviewValidation,
  getReviewValidation,
  updateReviewValidation,
} from "../utils/validation/review.validation";
import { allowedTo ,auth as protect } from "../controllers/auth.controller";


export const router = express.Router({mergeParams:true});

router
    .route("/")
    .post(protect, allowedTo("user"), createReviewMiddleWare, createReviewValidation, createReview)
    .get(getAllReviewMiddleWare, getReviews);

router
    .route("/:id")
    .patch(protect, allowedTo("user"), updateReviewValidation, updateReview)
    .get(getReviewValidation, getReview)
    .delete(protect, allowedTo("user", "admin", "superAdmin"), deleteReviewValidation, deleteReview);

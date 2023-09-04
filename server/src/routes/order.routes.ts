import express from "express";

import {
  createCashOrder,
  filterOrderByCurrentUser,
  getAllOrder,
  getSpecificOrder,
  getSpecificOrderCheck,
  updateIsDeliverd,
  updateIsPaid,
  checkOutSession
} from "../controllers/order.controller";
import { auth as protect, allowedTo } from "../controllers/auth.controller";
import { orderValidation } from "../utils/validation/order.validation";

export const router = express.Router();

router.get("/check-out-session", protect, allowedTo("user"), checkOutSession);

router
  .route("/")
  .post(protect, allowedTo("user"), createCashOrder)
  .get(
    protect,
    allowedTo("user", "admin", "superAdmin"),
    filterOrderByCurrentUser,
    getAllOrder
  );

router
  .route("/:id")
  .get(
    protect,
    allowedTo("user", "admin", "superAdmin"),
    orderValidation,
    getSpecificOrderCheck,
    getSpecificOrder
  );

router.patch(
  "/deliver/:id",
  protect,
  allowedTo("admin", "superAdmin"),
  orderValidation,
  updateIsDeliverd
);
router.patch(
  "/pay/:id",
  protect,
  allowedTo("admin", "superAdmin"),
  orderValidation,
  updateIsPaid
);



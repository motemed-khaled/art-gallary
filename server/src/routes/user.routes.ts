import express from "express";

import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserPassword
} from "../controllers/user.controller";
import {
  createUserValidation,
  getUserValidation,
  updateUservalidation,
  deleteUserValidation,
  updateUserPasswordValidation
} from "../utils/validation/user.validate";
import { auth as protect , allowedTo } from "../controllers/auth.controller";

export const router = express.Router();


router.use(protect, allowedTo("admin", "superAdmin"));
router.patch("/changePassword/:id" , updateUserPasswordValidation , updateUserPassword)
router.route("/").post(createUserValidation, createUser).get(getUsers);
router
  .route("/:id")
  .get(getUserValidation, getUser)
  .patch(updateUservalidation, updateUser)
  .delete(deleteUserValidation, deleteUser);

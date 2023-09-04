import express from "express";

import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserPassword,
  userImgProccessing,
  uploadImg
} from "../controllers/user.controller";
import {
  createUserValidation,
  getUserValidation,
  updateUservalidation,
  deleteUserValidation,
  updateUserPasswordValidation,
  updateLoggedUservalidation,
  updateLoggedUserPasswordValidation
} from "../utils/validation/user.validate";
import { auth as protect, allowedTo } from "../controllers/auth.controller";
import { getLoggedUser , updateLoggedUser , updateLogedUserPassword ,deleteLoggedUser } from "../controllers/loggedUser.controller";

export const router = express.Router();



router.use(protect);
router.get("/getloggeduser", getLoggedUser, getUser);
router.patch("/updateloggeduser",uploadImg , userImgProccessing, updateLoggedUservalidation, updateLoggedUser);
router.patch("/updateloggeduserpassword", updateLoggedUserPasswordValidation, updateLogedUserPassword);
router.delete("/deleteloggeduser", deleteLoggedUser, deleteUser);



router.use(allowedTo("admin", "superAdmin"));
router.patch("/changePassword/:id" , updateUserPasswordValidation , updateUserPassword)
router.route("/").post(uploadImg , userImgProccessing , createUserValidation, createUser).get(getUsers);
router
  .route("/:id")
  .get(getUserValidation, getUser)
  .patch(uploadImg , userImgProccessing,updateUservalidation, updateUser)
  .delete(deleteUserValidation, deleteUser);

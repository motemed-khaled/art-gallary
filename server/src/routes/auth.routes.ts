import express from "express";


import { signUp ,login } from "../controllers/auth.controller";
import { signUpValidation, loginValidation } from "../utils/validation/auth.validation";
import { forgetPasswordValidation,resetPasswordValidation,verifyResetCodeValidation } from "../utils/validation/forgetPassword.validation";

import { forgetPassword , verifyResetCode , changePassword } from "../controllers/forgetPassword.controller";

export const router = express.Router();

router.post("/signup", signUpValidation, signUp);
router.post("/login", loginValidation, login);

router.post("/forgetPassword",forgetPasswordValidation , forgetPassword);
router.post("/verifyResetCode",verifyResetCodeValidation, verifyResetCode);
router.post("/resetPassword",resetPasswordValidation, changePassword);
import express from "express";


import { signUp ,login } from "../controllers/auth.controller";
import { signUpValidation , loginValidation } from "../utils/validation/auth.validation";

export const router = express.Router();

router.post("/signup", signUpValidation, signUp);
router.post("/login", loginValidation, login);
import { check } from "express-validator";

import { validationMiddleware } from "../../middleWares/validation.middleware";



export const orderValidation = [
    check("id").isMongoId()
        .withMessage("invalid id format"),
    validationMiddleware
];
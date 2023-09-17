import { validationResult } from "express-validator";
import { Request , Response , NextFunction } from "express";

export const validationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(406).json({ errors: errors.array() });
        return;
    }
    next();
};
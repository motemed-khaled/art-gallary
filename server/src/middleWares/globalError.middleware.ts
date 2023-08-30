import { Request , Response , NextFunction } from "express";
import { ApiError } from './../utils/apiError';






const jwtInvalidSigniture = () => new ApiError("Invalid token Please login again!", 401);
const TokenExpiredError = () => new ApiError("Expired token Please login again!", 401);

export const globalError = (err: ApiError, req: Request, res: Response, next: NextFunction)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error"

    if (process.env.NODE_ENV === "development") {
        sendErrorForDevelopment(res, err);
    } else {
        if (err.name === "JsonWebTokenError") {
            err = jwtInvalidSigniture();
            return;
        };
        if (err.name === "TokenExpiredError") {
            err = TokenExpiredError()
            return;
        };
        sendErrorForProduction(res, err);
    }
}

const sendErrorForDevelopment = (res:Response , err:ApiError) => {
    res.status(err.statusCode).json({
        status: err.status,
        err: err,
        message: err.message,
        stack:err.stack
    })
}

const sendErrorForProduction = (res:Response , err:ApiError) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    })
}
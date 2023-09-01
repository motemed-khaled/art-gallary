import { Request } from "express";
import { UserDocument } from "./user.interface";

export interface ExpressReq extends Request{
    user?: UserDocument;
    filterObj?: {};
}
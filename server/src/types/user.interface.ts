import { Document } from "mongoose";

export interface Usre{
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    userImg: string;
    address: string;
}

export interface UserDocument extends Usre, Document{
    validatePassword(password: string): Promise<boolean>;
}
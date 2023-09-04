import { Document , Schema } from "mongoose";

export interface Usre{
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    userImg: string;
    address: string;
    changePasswordTime: Date;
    resetPasswordCode: string;
    resetCodeExpire: number;
    resetCodeVerify: boolean;
}

export interface UserDocument extends Usre, Document{
    validatePassword(password: string): Promise<boolean>;
}
import mongoose, { Document , Schema } from "mongoose";

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
    signUpResetCode: string;
    signUpResetCodeExpire: number;
    signUpVerify: boolean;
    wishList: [{
        product:mongoose.Schema.Types.ObjectId
    }]
}

export interface UserDocument extends Usre, Document{
    validatePassword(password: string): Promise<boolean>;
}
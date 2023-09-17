import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import asyncHandler from "express-async-handler";


import { UserDocument } from "../types/user.interface";

const userSchema = new mongoose.Schema<UserDocument>({
    name: {
        type: String,
        required: [true, "userName is required"],
        minlength: [5, "to short userName"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
    },
    phone: {
        type: String,
        required: [true, "user phone is required"]
    },
    userImg: {
        type: String,
    },
    address: {
        type: String,
        required: [true, "user adress required"]
    },
    password: {
        type: String,
        select:false
    },
    role: {
        type: String,
        enum: ["user", "admin", "superAdmin"],
        default:"user"
    },
    changePasswordTime: {
        type:Date
    },
    resetPasswordCode: String,
    resetCodeExpire: Number,
    resetCodeVerify: Boolean,
    signUpResetCode: String,
    signUpResetCodeExpire: Number,
    signUpVerify: {
        type: Boolean,
        default:false
    },
    wishList: [{
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "products"
        }
    }]
}, { timestamps: true });

const setImgUrl = (doc:UserDocument) => {
    if (doc.userImg) {
        const imgUrl = `${process.env.BASE_URL}/users/${doc.userImg}`
        doc.userImg = imgUrl;
    }
}

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        this.password = await bcryptjs.hash(this.password, 12);
        return next();
    } catch (err) {
        return next(err as Error);
    }
});

userSchema.post("init", (doc) => {
    setImgUrl(doc);
});

userSchema.post("save", (doc) => {
    setImgUrl(doc);
});

userSchema.methods.validatePassword = async function (password: string):Promise<boolean> {
    return await bcryptjs.compare(password, this.password);
};

export const userModel = mongoose.model<UserDocument>("users", userSchema);
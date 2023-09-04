import mongoose from "mongoose";
import { CategoryDocument } from "../types/category.interface";

const categorySchema = new mongoose.Schema<CategoryDocument>({
    name: {
        type: String,
        required: [true, "category name required"]
    }
}, { timestamps: true });

export const categoryModel = mongoose.model<CategoryDocument>("Category" ,categorySchema)
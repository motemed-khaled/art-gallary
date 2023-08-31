import { Document } from "mongoose";

export interface Category {
    name: string;
}

export interface CategoryDocument extends Category, Document{
}
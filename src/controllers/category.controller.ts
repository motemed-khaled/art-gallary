
import { categoryModel } from "../models/category.model";
import { deleteOne , getOne , updateOne , createOne , getAll } from "./handlers.controller";


export const createCategory = createOne(categoryModel);

export const getCategories = getAll(categoryModel);

export const getCategory = getOne(categoryModel);

export const updateCategory = updateOne(categoryModel);

export const deleteCategory = deleteOne(categoryModel);
    
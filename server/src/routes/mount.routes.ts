import { Application } from "express";
import { router as userRoutes } from "./user.routes";
import { router as authRoutes } from "./auth.routes";
import { router as categoryRoutes } from "./category.routes";


export const mountRoutes = (app: Application) => {
    app.use("/api/v1/users", userRoutes);
    app.use("/api/v1/auth", authRoutes);
    app.use("/api/v1/category", categoryRoutes);
}
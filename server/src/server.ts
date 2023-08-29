import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { dbConnection } from "./config/database";
import { globalError } from "./middleWares/globalError.middleware";


// connect db
dbConnection();
const app = express();


// handle express global error
app.use(globalError);

const PORT=process.env.PORT || 5000
const server = app.listen(PORT, () => {
    console.log("app run in port 5000");
});
//handle error outside express
process.on("unhandledRejection", (err: Error) => {
    console.error(`unhandledRejection : ${err.name}|${err.message}`);
    server.close(() => {
        process.exit(1);
    });
});
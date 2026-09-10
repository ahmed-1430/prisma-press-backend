import cookieParser from "cookie-parser";
import express, {Application, Request, Response} from "express";
import cors from "cors";
import config from "./config";
import httpStatus from "http-status";
import { db as prisma } from "./prisma/db";
import bcrypt from "bcryptjs";


const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: config.app_url,
}));

app.get("/", (req:Request, res:Response) => {
    res.send("Hello World!" );
}
)


export default app;
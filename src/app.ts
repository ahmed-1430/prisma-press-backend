import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
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

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
}
)


app.post("/api/user/register", async (req: Request, res: Response) => {
    const { name, email, password, profilePhoto, } = req.body;
    // console.log(payload);
    const isUserExist = await prisma.orm.public.User.where({ email }).first();

    if (isUserExist) {
        throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

    const createdUser = await prisma.transaction(async (tx) => {
        const createdUser = await tx.orm.public.User.create({
            name,
            email,
            password: hashedPassword,
        });

        await tx.orm.public.Profile.create({
            userId: createdUser.id,
            avatarUrl: profilePhoto,
        });

                return createdUser;
    });
    const user = await prisma.orm.public.User
        .where({ email: createdUser.email, id: createdUser.id })
        .first();

    res.status(httpStatus.CREATED).json({
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registered successfully",
        data: {
            user               
        }});

}
)


export default app;
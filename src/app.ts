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


app.post("/api/user/register", async (req:Request, res:Response) => {
    const {name, email, password, profilePhoto, } = req.body;
    // console.log(payload);
    const isUserExist = await prisma.orm.public.User.where({ email }).first();

    if (isUserExist) {
        throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

    await prisma.transaction(async (tx) => {
        const user = await tx.orm.public.User.create({
            name,
            email,
            password: hashedPassword,
        });

        if (profilePhoto) {
            await tx.orm.public.Profile.create({
                userId: user.id,
                avatarUrl: profilePhoto,
            });
        }
    });

    res.status(httpStatus.CREATED).json({ message: "User registered successfully" });
    
}
)


export default app;
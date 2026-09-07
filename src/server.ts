import app from "./app";
import { db as prisma } from "./prisma/db";

const PORT = process.env.PORT || 3000;
async function main() {
    try {
        await prisma.orm.public.User.where({ id: -1 }).first();
        console.log(`Database connected successfully`);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
}

main();
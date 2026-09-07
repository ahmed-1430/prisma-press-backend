import app from "./app";
import config from "./config";
import { db as prisma } from "./prisma/db";

const PORT = config.PORT;
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
import logger from "@/lib/dnaLogger";
import { connectToDatabase, closeConnection } from "@/lib/mongodb";

export async function GET() {
    try {
        logger.info("GET request received for add-ins");

        const { db } = await connectToDatabase();
        const addInsCollection = db.collection("add-ins");
        const addIns = await addInsCollection.find().toArray();
        await closeConnection();

        return new Response(JSON.stringify(addIns), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "public, max-age=3600",
            },
        });
    } catch (error) {
        logger.error(`Error fetching addIns: ${error.message}`);
        try {
            await closeConnection();
        } catch (closeError) {
            logger.error(`Error closing MongoDB connection: ${closeError.message}`);
        }

        return new Response(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}

import logger from "@/lib/dnaLogger";
import { connectToDatabase, closeConnection } from "@/lib/mongodb";

export async function GET() {
    let client;
    try {
        logger.info("GET request received for add-ins");
        const { client: dbClient, db } = await connectToDatabase();
        client = dbClient;
        const addInsCollection = db.collection("add-ins");
        const addIns = await addInsCollection.find().toArray();

        await closeConnection(client);

        return new Response(JSON.stringify(addIns), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "public, max-age=3600", // Cache for 1 hour
            },
        });
    } catch (error) {
        logger.error(`Error fetching addIns: ${error.message}`);
        if (client) {
            try {
                await closeConnection(client);
            } catch (closeError) {
                logger.error(`Error closing MongoDB connection: ${closeError.message}`);
            }
        }

        return new Response(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}

import logger from "@/lib/dnaLogger";
import { connectToDatabase, closeConnection } from "@/lib/mongodb";

export async function GET() {
    try {
        logger.info("GET request received for menu items");

        const { db } = await connectToDatabase();
        const menuCollection = db.collection("menu");
        const menuItems = await menuCollection.find().toArray();
        await closeConnection();

        return new Response(JSON.stringify(menuItems), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "public, max-age=3600", // Cache for 1 hour
            },
        });
    } catch (error) {
        logger.error(`Error fetching menu items: ${error.message}`);
        try {
            await closeConnection();
        } catch (closeError) {
            logger.error(`Error closing MongoDB connection: ${closeError.message}`);
        }

        return new Response(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}

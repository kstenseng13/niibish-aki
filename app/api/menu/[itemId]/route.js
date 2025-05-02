import logger from "@/lib/dnaLogger";
import { connectToDatabase, closeConnection, createObjectId, isValidObjectId } from "@/lib/mongodb";

export async function GET(_, { params }) {
    let client;
    try {
        const resolvedParams = await params;
        const { itemId } = resolvedParams;

        if (!itemId) {
            return new Response(JSON.stringify({ message: "Item ID is required" }), { status: 400 });
        }

        if (!isValidObjectId(itemId)) {
            logger.error(`Invalid ObjectId format: ${itemId}`);
            return new Response(JSON.stringify({ message: "Invalid item ID format" }), { status: 400 });
        }

        let objectId;
        try {
            objectId = createObjectId(itemId);
        } catch (error) {
            logger.error(`Failed to create ObjectId: ${error.message}`);
            return new Response(JSON.stringify({ message: "Invalid item ID format" }), { status: 400 });
        }

        // Get both client and db to ensure we can close the specific connection
        const { client: dbClient, db } = await connectToDatabase();
        client = dbClient;

        const menuCollection = db.collection("menu");
        const menuItem = await menuCollection.findOne({ _id: objectId });

        // Close the connection when done with the database operations
        await closeConnection(client);

        if (!menuItem) {
            logger.warn(`Menu item not found: ${itemId}`);
            return new Response(JSON.stringify({ message: "Menu item not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(menuItem), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "public, max-age=3600", // Cache for 1 hour
            },
        });
    } catch (error) {
        logger.error(`Error fetching menu item: ${error.message}`);

        // Make sure to close the connection even if there's an error
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


import { MongoClient, ObjectId } from "mongodb";
import { loadEnvConfig } from "@next/env";
import logger from "@/lib/dnaLogger";
loadEnvConfig(process.cwd());

const uri = process.env.MONGODB_URI;

export async function GET(req, { params }) {
    try {
        // Await params before destructuring
        const resolvedParams = await params;
        const { itemId } = resolvedParams;

        if (!itemId) {
            return new Response(JSON.stringify({ message: "Item ID is required" }), { status: 400 });
        }

        const client = new MongoClient(uri);
        await client.connect();
        logger.info("Connected to MongoDB.");

        const database = client.db("niibish-aki");
        const menuCollection = database.collection("menu");

        let objectId;
        try {
            // Use the string constructor to avoid deprecation warning
            objectId = new ObjectId(String(itemId));
        } catch (error) {
            logger.error(`Invalid ObjectId format: ${itemId}`);
            return new Response(JSON.stringify({ message: "Invalid item ID format" }), { status: 400 });
        }

        // Find the menu item
        const menuItem = await menuCollection.findOne({ _id: objectId });

        if (!menuItem) {
            logger.warn(`Menu item not found: ${itemId}`);
            return new Response(JSON.stringify({ message: "Menu item not found" }), { status: 404 });
        }

        await client.close();
        logger.info("Closed MongoDB connection.");

        return new Response(JSON.stringify(menuItem), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        logger.error(`Error fetching menu item: ${error.message}`);
        return new Response(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}

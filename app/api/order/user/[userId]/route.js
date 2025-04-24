import { MongoClient, ObjectId } from "mongodb";
import { loadEnvConfig } from "@next/env";
import logger from "@/lib/dnaLogger";

loadEnvConfig(process.cwd());
const uri = process.env.MONGODB_URI;

export async function GET(req, { params }) {
    try {
        const { userId } = params;

        if (!userId) {
            return new Response(JSON.stringify({ message: "User ID is required" }), { status: 400 });
        }

        const client = new MongoClient(uri);
        await client.connect();
        logger.info("Connected to MongoDB.");

        const database = client.db("niibish-aki");
        const ordersCollection = database.collection("order");

        if (!ObjectId.isValid(userId)) {
            logger.error(`Invalid ObjectId format: ${userId}`);
            return new Response(JSON.stringify({ message: "Invalid user ID format" }), { status: 400 });
        }

        const orders = await ordersCollection.find({
            userId: userId,
            status: "complete"
        }).sort({ createdAt: -1 }).toArray();

        if (!orders || orders.length === 0) {
            logger.warn(`No orders found for user: ${userId}`);
            return new Response(JSON.stringify({ message: "No orders found for this user" }), { status: 404 });
        }

        await client.close();
        logger.info("Closed MongoDB connection.");

        return new Response(JSON.stringify(orders), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        logger.error(`Error fetching user orders: ${error.message}`);
        return new Response(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}

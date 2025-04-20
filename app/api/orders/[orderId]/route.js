import { MongoClient, ObjectId } from "mongodb";
import { loadEnvConfig } from "@next/env";
import logger from "@/lib/dnaLogger";

loadEnvConfig(process.cwd());
const uri = process.env.MONGODB_URI;

export async function GET(req, { params }) {
    try {
        const { orderId } = await params;
        
        if (!orderId) {
            return new Response(JSON.stringify({ message: "Order ID is required" }), { status: 400 });
        }

        const client = new MongoClient(uri);
        await client.connect();
        logger.info("Connected to MongoDB.");

        const database = client.db("niibish-aki");
        const ordersCollection = database.collection("order");

        // Convert string ID to ObjectId
        let objectId;
        try {
            objectId = new ObjectId(orderId);
        } catch (error) {
            logger.error(`Invalid ObjectId format: ${orderId}`);
            return new Response(JSON.stringify({ message: "Invalid order ID format" }), { status: 400 });
        }

        // Find the order
        const order = await ordersCollection.findOne({ _id: objectId });
        
        if (!order) {
            logger.warn(`Order not found: ${orderId}`);
            return new Response(JSON.stringify({ message: "Order not found" }), { status: 404 });
        }

        await client.close();
        logger.info("Closed MongoDB connection.");

        return new Response(JSON.stringify(order), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        logger.error(`Error fetching order: ${error.message}`);
        return new Response(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}

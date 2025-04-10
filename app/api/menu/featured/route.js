import { MongoClient } from "mongodb";
import { loadEnvConfig } from "@next/env";
import logger from "@/lib/dnaLogger";
loadEnvConfig(process.cwd());

const uri = process.env.MONGODB_URI;

export async function GET(req) {
    try {
        logger.info("GET request received for featured menu items");

        const client = new MongoClient(uri);
        await client.connect();
        logger.info("Connected to MongoDB.");

        const database = client.db("niibish-aki");
        const menuCollection = database.collection("menu");

        const featuredItems = await menuCollection.find({ category: 0 }).toArray();

        await client.close();
        logger.info("Closed MongoDB connection.");

        return new Response(JSON.stringify(featuredItems), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        logger.error(`Error fetching featured menu items: ${error.message}`);
        return new Response(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}

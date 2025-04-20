import { MongoClient, ObjectId } from "mongodb";
import { loadEnvConfig } from "@next/env";
import logger from "@/lib/dnaLogger";

loadEnvConfig(process.cwd());
const uri = process.env.MONGODB_URI;

export async function POST(req) {
    try {
        const { userId, item } = await req.json();
        
        const client = new MongoClient(uri);
        await client.connect();
        logger.info("Connected to MongoDB.");

        const database = client.db("niibish-aki");
        const ordersCollection = database.collection("order");

        // Check for existing cart
        const existingCart = await ordersCollection.findOne({
            userId: userId,
            status: "cart"
        });

        if (existingCart) {
            // Check if cart has less than 20 items
            if (existingCart.items.length >= 20) {
                return new Response(JSON.stringify({ message: "Cart is full" }), { status: 400 });
            }

            // Add item to existing cart
            const result = await ordersCollection.updateOne(
                { _id: existingCart._id },
                { 
                    $push: { items: item },
                    $set: { 
                        updatedAt: new Date()
                    }
                }
            );
            return new Response(JSON.stringify({ orderId: existingCart._id }), { status: 200 });
        }

        // Create new cart
        const newCart = {
            userId: userId,
            items: [item],
            bill: {
                subtotal: 0,
                tax: 0,
                tip: 0,
                total: 0
            },
            status: "cart",
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await ordersCollection.insertOne(newCart);
        return new Response(JSON.stringify({ orderId: result.insertedId }), { status: 201 });

    } catch (error) {
        logger.error(`Error managing order: ${error.message}`);
        return new Response(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}
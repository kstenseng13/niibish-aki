import { MongoClient } from "mongodb";
import { loadEnvConfig } from "@next/env";
import logger from "@/lib/dnaLogger";

loadEnvConfig(process.cwd());
const uri = process.env.MONGODB_URI;

export async function POST(req) {
    try {
        const requestBody = await req.json();

        const client = new MongoClient(uri);
        await client.connect();
        logger.info("Connected to MongoDB.");

        const database = client.db("niibish-aki");
        const ordersCollection = database.collection("order");

        if (requestBody.userId && requestBody.item) {
            const { userId, item } = requestBody;

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
                await ordersCollection.updateOne(
                    { _id: existingCart._id },
                    {
                        $push: { items: item }
                    }
                );

                // Close the connection
                await client.close();

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
                createdAt: new Date()
            };

            const result = await ordersCollection.insertOne(newCart);

            // Close the connection
            await client.close();

            return new Response(JSON.stringify({ orderId: result.insertedId }), { status: 201 });
        }
        // This is a full order creation (from the checkout process)
        else {
            const orderData = requestBody;

            // Validate required fields
            if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
                return new Response(JSON.stringify({ message: "Order must contain items" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                });
            }

            // Prepare the order document
            // Create a clean customerInfo object without address fields at the top level
            const cleanCustomerInfo = { ...orderData.customerInfo || {} };
            // Remove city, state, zipcode from the top level of customerInfo
            if (cleanCustomerInfo) {
                delete cleanCustomerInfo.city;
                delete cleanCustomerInfo.state;
                delete cleanCustomerInfo.zipCode;
                delete cleanCustomerInfo.zipcode;
            }

            const orderDocument = {
                userId: orderData.userId || 'guest',
                items: orderData.items,
                bill: orderData.bill || {
                    subtotal: 0,
                    tax: 0,
                    tip: 0,
                    total: 0
                },
                customerInfo: cleanCustomerInfo,
                tipPercentage: parseFloat(orderData.tipPercentage) || 0,
                status: 'complete',
                createdAt: new Date()
            };

            // Insert the order
            const result = await ordersCollection.insertOne(orderDocument);

            // Close the connection
            await client.close();

            // Return the order ID
            return new Response(JSON.stringify({
                message: "Order created successfully",
                orderId: result.insertedId.toString()
            }), {
                status: 201,
                headers: { "Content-Type": "application/json" }
            });
        }

    } catch (error) {
        logger.error(`Error managing order: ${error.message}`);
        return new Response(JSON.stringify({ message: "Something went wrong!" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

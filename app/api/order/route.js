import logger from "@/lib/dnaLogger";
import { connectToDatabase, closeConnection } from "@/lib/mongodb";

export async function POST(req) {
    try {
        const requestBody = await req.json();
        const { db } = await connectToDatabase();
        const ordersCollection = db.collection("order");

        if (requestBody.userId && requestBody.item) {
            const { userId, item } = requestBody;

            const existingCart = await ordersCollection.findOne({
                userId: userId,
                status: "cart"
            });

            if (existingCart) {
                if (existingCart.items.length >= 20) {
                    return new Response(JSON.stringify({ message: "Cart is full" }), { status: 400 });
                }

                await ordersCollection.updateOne(
                    { _id: existingCart._id },
                    {
                        $push: { items: item }
                    }
                );
                await closeConnection();

                return new Response(JSON.stringify({ orderId: existingCart._id }), { status: 200 });
            }

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
            await closeConnection();

            return new Response(JSON.stringify({ orderId: result.insertedId }), { status: 201 });
        }
        // This is a full order creation
        else {
            const orderData = requestBody;

            if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
                return new Response(JSON.stringify({ message: "Order must contain items" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                });
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
                customerInfo: orderData.customerInfo || {},
                address: orderData.customerInfo?.address || {},
                tipPercentage: parseFloat(orderData.tipPercentage) || 0,
                status: 'complete',
                createdAt: new Date()
            };

            const result = await ordersCollection.insertOne(orderDocument);
            await closeConnection();

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
        try {
            await closeConnection();
        } catch (closeError) {
            logger.error(`Error closing MongoDB connection: ${closeError.message}`);
        }

        return new Response(JSON.stringify({ message: "Something went wrong!" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

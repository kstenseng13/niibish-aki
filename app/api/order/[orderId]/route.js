import logger from "@/lib/dnaLogger";
import { connectToDatabase, createObjectId, isValidObjectId } from "@/lib/mongodb";

export async function GET(_, { params }) {
    try {
        const { orderId } = await params;

        if (!orderId) {
            return new Response(JSON.stringify({ message: "Order ID is required" }), { status: 400 });
        }

        if (!isValidObjectId(orderId)) {
            logger.error(`Invalid ObjectId format: ${orderId}`);
            return new Response(JSON.stringify({ message: "Invalid order ID format" }), { status: 400 });
        }

        let objectId;
        try {
            objectId = createObjectId(orderId);
        } catch (error) {
            logger.error(`Failed to create ObjectId: ${error.message}`);
            return new Response(JSON.stringify({ message: "Invalid order ID format" }), { status: 400 });
        }

        const { db } = await connectToDatabase();
        const ordersCollection = db.collection("order");
        const order = await ordersCollection.findOne({ _id: objectId });

        if (!order) {
            logger.warn(`Order not found: ${orderId}`);
            return new Response(JSON.stringify({ message: "Order not found" }), { status: 404 });
        }

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

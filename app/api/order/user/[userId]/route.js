import logger from "@/lib/dnaLogger";
import { connectToDatabase, isValidObjectId } from "@/lib/mongodb";

export async function GET(_, { params }) {
    try {
        const { userId } = params;

        if (!userId) {
            return new Response(JSON.stringify({ message: "User ID is required" }), { status: 400 });
        }

        if (!isValidObjectId(userId)) {
            logger.error(`Invalid ObjectId format: ${userId}`);
            return new Response(JSON.stringify({ message: "Invalid user ID format" }), { status: 400 });
        }

        const { db } = await connectToDatabase();
        const ordersCollection = db.collection("order");

        const orders = await ordersCollection.find({
            userId: userId,
            status: "complete"
        }).sort({ createdAt: -1 }).toArray();

        if (!orders || orders.length === 0) {
            logger.warn(`No orders found for user: ${userId}`);
            return new Response(JSON.stringify({ message: "No orders found for this user" }), { status: 404 });
        }

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

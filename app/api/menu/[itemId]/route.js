import logger from "@/lib/dnaLogger";
import { connectToDatabase, createObjectId, isValidObjectId } from "@/lib/mongodb";

export async function GET(_, { params }) {
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

        const { db } = await connectToDatabase();
        const menuCollection = db.collection("menu");
        const menuItem = await menuCollection.findOne({ _id: objectId });

        if (!menuItem) {
            logger.warn(`Menu item not found: ${itemId}`);
            return new Response(JSON.stringify({ message: "Menu item not found" }), { status: 404 });
        }

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


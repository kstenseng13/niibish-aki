import logger from "@/lib/dnaLogger";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
    try {
        logger.info("GET request received for menu items");

        const { db } = await connectToDatabase();
        const menuCollection = db.collection("menu");
        const menuItems = await menuCollection.find().toArray();
        return new Response(JSON.stringify(menuItems), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        logger.error(`Error fetching menu items: ${error.message}`);
        return new Response(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}

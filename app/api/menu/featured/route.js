import logger from "@/lib/dnaLogger";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
    try {
        logger.info("GET request received for featured menu items");

        const { db } = await connectToDatabase();
        const menuCollection = db.collection("menu");
        const featuredItems = await menuCollection.find({ category: 0 }).toArray();

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

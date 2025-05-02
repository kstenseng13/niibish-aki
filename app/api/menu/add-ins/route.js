import logger from "@/lib/dnaLogger";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
    try {
        logger.info("GET request received for add-ins");

        const { db } = await connectToDatabase();
        const addInsCollection = db.collection("add-ins");
        const addIns = await addInsCollection.find().toArray();

        return new Response(JSON.stringify(addIns), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        logger.error(`Error fetching addIns: ${error.message}`);
        return new Response(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}

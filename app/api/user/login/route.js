import { MongoClient, ServerApiVersion } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loadEnvConfig } from '@next/env';
import logger from "@/lib/dnaLogger";
import { sanitizeInput } from "@/lib/sanitize";
loadEnvConfig(process.cwd());

const uri = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
    try {
        logger.info("POST request received for user login.");

        const { username, password } = await req.json();
        sanitizeInput(username);
        sanitizeInput(password);
        const client = new MongoClient(uri);

        await client.connect();
        logger.info("Connected to MongoDB.");

        const database = client.db("niibish-aki");
        const collection = database.collection("users");
        const user = await collection.findOne({ username });

        if (!user) {
            logger.warn(`Login failed - username not found: ${username}`);
            return new Response(JSON.stringify({ message: "Invalid username or password" }), { status: 401 });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            logger.warn(`Login failed - incorrect password for username: ${username}`);
            return new Response(JSON.stringify({ message: "Invalid username or password" }), { status: 401 });
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: "7d" });

        // Process user object to ensure consistent format
        const processedUser = {
            ...user,
            _id: user._id.toString(),
            address: user.address || {
                line1: '',
                line2: '',
                city: '',
                state: '',
                zipcode: ''
            }
        };

        // Remove password from the user object
        delete processedUser.password;

        await client.close();
        logger.info(`User logged in successfully: ${username}`);

        return new Response(JSON.stringify({ message: "Login successful", token, user: processedUser }), { status: 200 });

    } catch (error) {
        logger.error(`Login error: ${error.message}`);
        return new Response(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}

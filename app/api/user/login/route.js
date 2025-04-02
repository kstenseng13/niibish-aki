import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "../../../lib/dnaLogger"; // Import Mezmo logger
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd()); 


//TODO: RETURN USER DATA (minus password) AND POPULATE THAT IN THE LOGIN() FUNCTION IN LOGIN/PAGE.JS
const uri = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
    try {
        logger.info("POST request received for user login.");

        const { username, password } = await req.json();

        const client = new MongoClient(uri);
        await client.connect();
        logger.info("Connected to MongoDB.");

        const database = client.db("niibish-aki");
        const collection = database.collection("users");

        // Find user by username
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

        await client.close();
        logger.info(`User logged in successfully: ${username}`);

        return new Response(JSON.stringify({ message: "Login successful", token }), { status: 200 });

    } catch (error) {
        logger.error(`Login error: ${error.message}`);
        return new Response(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}

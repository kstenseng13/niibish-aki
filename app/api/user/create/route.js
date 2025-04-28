import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loadEnvConfig } from "@next/env";
import logger from "@/lib/dnaLogger.js";
import { sanitizeInput } from "@/lib/sanitize";
loadEnvConfig(process.cwd());

const uri = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
    try {
        logger.info("POST request received for user creation.");

        let { user } = await req.json();
        if (!user) {
            logger.error("User data is required!");
            return new Response(JSON.stringify({ message: "User data is required!" }), { status: 400 });
        }

        user = {
            firstName: sanitizeInput(user.firstName),
            lastName: sanitizeInput(user.lastName),
            username: sanitizeInput(user.username),
            email: sanitizeInput(user.email),
            phoneNumber: sanitizeInput(user.phoneNumber),
            password: user.password
        };

        const client = new MongoClient(uri);
        await client.connect();
        logger.info("Connected to MongoDB.");

        const database = client.db("niibish-aki");
        const collection = database.collection("users");

        // Check if user already exists
        const existingUser = await collection.findOne({ username: user.username });

        if (existingUser) {
            logger.warn(`Username already exists: ${user.username}`);
            await client.close();
            return new Response(JSON.stringify({ message: "Username already exists!" }), { status: 409 });
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(user.password, 10);

        const response = await collection.insertOne({
            ...user,
            password: hashedPassword,
        });

        if (!response.acknowledged) {
            logger.error("Failed to save user.");
            await client.close();
            return new Response(JSON.stringify({ message: "User not saved!" }), { status: 500 });
        }

        const newUser = await collection.findOne({ _id: response.insertedId });

        // Ensure the user object has the correct structure and remove password
        const processedUser = {
            ...newUser,
            _id: response.insertedId.toString(),
            address: newUser.address || {
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
        logger.info("MongoDB connection closed.");

        /// Generate JWT Token for new user
        const token = jwt.sign({ userId: response.insertedId, username: newUser.username }, JWT_SECRET, { expiresIn: "7d" });

        logger.info(`User registered successfully: ${newUser.username}`);
        return new Response(JSON.stringify({ message: "User created successfully", token, user: processedUser }), { status: 201 });

    } catch (error) {
        logger.error(`Error in user creation: ${error.message}`);
        return new Response(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}

export async function GET() {
    logger.info("GET request received at postCreateUser endpoint.");
    return new Response(JSON.stringify({ message: "You've hit the postCreateUser endpoint" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

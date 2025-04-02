import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import logger from "../../../lib/dnaLogger";
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd()); 

const uri = process.env.MONGODB_URI;

export async function POST(req) {
    try {
        logger.info("POST request received for user creation.");

        // Check if the request contains an Authorization header with a Bearer token
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            logger.warn("Authorization header missing.");
            return new Response(JSON.stringify({ message: "Authorization header missing" }), { status: 403 });
        }

        const token = authHeader.split(" ")[1];  // Extract token from Bearer token
        if (!token) {
            logger.warn("Token missing.");
            return new Response(JSON.stringify({ message: "Token missing" }), { status: 403 });
        }

        // Verify the token using the verifyToken function
        let decoded;
        try {
            decoded = verifyToken(token);  // Decodes the JWT and returns the payload
        } catch (error) {
            logger.error(`Invalid or expired token: ${error.message}`);
            return new Response(JSON.stringify({ message: "Invalid or expired token" }), { status: 403 });
        }

        logger.info(`Authenticated user: ${decoded.username}`);

        // Proceed with user creation logic
        const { user } = await req.json();

        if (!user) {
            logger.error("User data is required!");
            return new Response(JSON.stringify({ message: "User data is required!" }), { status: 400 });
        }

        const client = new MongoClient(uri);
        await client.connect();
        logger.info("Connected to MongoDB.");

        const database = client.db("niibish-aki");
        const collection = database.collection("users");

        // Check if user already exists
        const existingUser = await collection.findOne({
            $or: [{ username: user.username }, { email: user.email }]
        });

        if (existingUser) {
            logger.warn(`Username or email already exists: ${user.username}`);
            return new Response(JSON.stringify({ message: "Username or email already exists!" }), { status: 409 });
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(user.password, 10);

        const dbResponse = await collection.insertOne({
            ...user,
            password: hashedPassword,
        });

        await client.close();
        logger.info("MongoDB connection closed.");

        if (!dbResponse.acknowledged) {
            logger.error("Failed to save user.");
            return new Response(JSON.stringify({ message: "User not saved!" }), { status: 500 });
        }

        logger.info(`User created successfully! ID: ${dbResponse.insertedId}`);
        return new Response(JSON.stringify({ message: "User saved successfully!" }), { status: 201 });

    } catch (error) {
        logger.error(`MongoDB connection error: ${error.message}`);
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

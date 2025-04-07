import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loadEnvConfig } from '@next/env';
import logger from "@/lib/dnaLogger";
import { sanitizeInput } from "@/lib/sanitize";
loadEnvConfig(process.cwd());

const uri = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

async function verifyToken(req) {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
        throw new Error("Authorization token is missing");
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded.userId === 'string') {
            decoded.userId = ObjectId.createFromHexString(decoded.userId);
        }
        return decoded;
    } catch (error) {
        throw new Error("Invalid token");
    }
}

export async function PUT(req) {
    try {
        logger.info("PUT request received for user");
        const tokenPayload = await verifyToken(req);
        const userInput = await req.json();

        if (!userInput) {
            logger.error("User data is required!");
            return new Response(JSON.stringify({ message: "User data is required!" }), { status: 400 });
        }

        const client = new MongoClient(uri);
        await client.connect();
        logger.info("Connected to MongoDB.");
        const database = client.db("niibish-aki");
        const collection = database.collection("users");

        const existingUser = await collection.findOne({ _id: tokenPayload.userId });
        if (!existingUser) {
            logger.warn(`User not found: ${tokenPayload.userId}`);
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        // Build an object with only the fields that were provided and are non-empty.
        const updateFields = {};
        if (userInput.firstName && userInput.firstName.trim() !== "") {
            updateFields.firstName = sanitizeInput(userInput.firstName);
        }
        if (userInput.lastName && userInput.lastName.trim() !== "") {
            updateFields.lastName = sanitizeInput(userInput.lastName);
        }
        if (userInput.username && userInput.username.trim() !== "") {
            updateFields.username = sanitizeInput(userInput.username);
        }
        if (userInput.email && userInput.email.trim() !== "") {
            updateFields.email = sanitizeInput(userInput.email);
        }
        if (userInput.phoneNumber && userInput.phoneNumber.trim() !== "") {
            updateFields.phoneNumber = sanitizeInput(userInput.phoneNumber);
        }

        // Verify that the new password isn't the same as the current password
        if (userInput.password) {
            const passwordMatches = await bcrypt.compare(userInput.password, existingUser.password);
            if (passwordMatches) {
                logger.warn("New password cannot be the same as the current password.");
                return new Response(JSON.stringify({ message: "New password cannot be the same as the current password." }), { status: 400 });
            }
            updateFields.password = await bcrypt.hash(userInput.password, 10);
        }

        // If updating username, check that it's not taken by another user
        if (updateFields.username) {
            const duplicateUser = await collection.findOne({
                username: updateFields.username,
                _id: { $ne: tokenPayload.userId }
            });
            if (duplicateUser) {
                logger.warn("Username is already taken.");
                return new Response(JSON.stringify({ message: "Username is already taken." }), { status: 400 });
            }
        }

        if (Object.keys(updateFields).length === 0) {
            return new Response(JSON.stringify({ message: "No valid fields provided for update." }), { status: 400 });
        }

        const result = await collection.updateOne(
            { _id: tokenPayload.userId },
            { $set: updateFields }
        );

        if (result.modifiedCount === 0) {
            logger.warn("No changes were made to the user.");
            return new Response(JSON.stringify({ message: "No changes made" }), { status: 400 });
        }

        const updatedUser = await collection.findOne({ _id: tokenPayload.userId });
        if (updatedUser) {
            delete updatedUser.password;
        }

        return new Response(JSON.stringify({ message: "Update successful", user: updatedUser }), { status: 200 });
    } catch (error) {
        logger.error(`Error updating user: ${error.message}`);
        return new Response(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}

export async function GET(req) {
    try {
        logger.info("GET request received for user");
        const userData = await verifyToken(req);

        const client = new MongoClient(uri);
        await client.connect();
        logger.info("Connected to MongoDB.");
        const database = client.db("niibish-aki");
        const collection = database.collection("users");

        const user = await collection.findOne({ _id: userData._id });
        if (!user) {
            logger.warn(`User not found: ${userData._id}`);
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        const { password, ...userWithoutPassword } = user;
        return new Response(JSON.stringify(userWithoutPassword), { status: 200 });
    } catch (error) {
        logger.error(`Error fetching user: ${error.message}`);
        return new Response(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "@/lib/dnaLogger";
import { sanitizeInput } from "@/lib/sanitize";
import { connectToDatabase, closeConnection } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
    try {
        logger.info("POST request received for user login.");

        let { username, password } = await req.json();
        username = sanitizeInput(username).toLowerCase();
        sanitizeInput(password);

        const { db } = await connectToDatabase();
        const collection = db.collection("users");
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
        const token = jwt.sign({
            userId: user._id,
            username: user.username
        }, JWT_SECRET, { expiresIn: "7d" });

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

        await closeConnection();
        logger.info(`User logged in successfully: ${username}`);

        return new Response(JSON.stringify({ message: "Login successful", token, user: processedUser }), { status: 200 });

    } catch (error) {
        logger.error(`Login error: ${error.message}`);

        try {
            await closeConnection();
        } catch (closeError) {
            logger.error(`Error closing MongoDB connection: ${closeError.message}`);
        }

        return new Response(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}

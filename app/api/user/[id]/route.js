import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loadEnvConfig } from "@next/env";
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
        logger.error(`Token verification failed: ${error.message}`);
        throw new Error("Invalid token");
    }
}

export async function PUT(req) {
    try {
        logger.info("PUT request received for user");
        return await handleUserUpdate(req);
    } catch (error) {
        logger.error(`Error updating user: ${error.message}`);
        return new Response(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}

export async function GET(req) {
    try {
        logger.info("GET request received for user");
        const userData = await verifyToken(req);

        logger.info(`User data from token: ${JSON.stringify(userData)}`);

        let userId = userData.userId || userData._id;
        if (typeof userId === 'string') {
            try {
                userId = new ObjectId(userId);
                logger.info(`Converted string ID to ObjectId: ${userId}`);
            } catch (error) {
                logger.error(`Failed to convert ID to ObjectId: ${error.message}`);
                return new Response(JSON.stringify({ message: "Invalid user ID format" }), { status: 400 });
            }
        }

        const client = new MongoClient(uri);
        await client.connect();
        logger.info("Connected to MongoDB.");
        const database = client.db("niibish-aki");
        const collection = database.collection("users");

        logger.info(`Looking for user with ID: ${userId}`);
        const user = await collection.findOne({ _id: userId });
        if (!user) {
            logger.warn(`User not found: ${userId}`);
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        const { password, ...userWithoutPassword } = user;
        return new Response(JSON.stringify(userWithoutPassword), { status: 200 });
    } catch (error) {
        logger.error(`Error fetching user: ${error.message}`);
        return new Response(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}

async function handleUserUpdate(req) {
    const tokenPayload = await verifyToken(req);
    const userInput = await req.json();

    if (!userInput) {
        logger.error("User data is required!");
        return new Response(JSON.stringify({ message: "User data is required!" }), { status: 400 });
    }

    const client = new MongoClient(uri);
    await client.connect();
    logger.info("Connected to MongoDB.");
    
    try {
        const database = client.db("niibish-aki");
        const collection = database.collection("users");

        const existingUser = await collection.findOne({ _id: tokenPayload.userId });
        if (!existingUser) {
            logger.warn(`User not found: ${tokenPayload.userId}`);
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        const updateResult = await processUserUpdate(collection, existingUser, userInput, tokenPayload.userId);
        return updateResult;
    } finally {
        await client.close();
    }
}

async function processUserUpdate(collection, existingUser, userInput, userId) {
    const updateFields = buildUpdateFields(userInput);
    
    if (Object.keys(updateFields).length === 0) {
        return new Response(JSON.stringify({ message: "No valid fields provided for update." }), { status: 400 });
    }

    // Handle password update
    if (userInput.password) {
        const passwordResult = await handlePasswordUpdate(userInput.password, existingUser.password);
        if (passwordResult.error) {
            return passwordResult.response;
        }
        updateFields.password = passwordResult.hashedPassword;
    }

    // Check username uniqueness
    if (updateFields.username) {
        const usernameResult = await checkUsernameUniqueness(collection, updateFields.username, userId);
        if (usernameResult.error) {
            return usernameResult.response;
        }
    }

    return await updateUserAndRespond(collection, userId, updateFields);
}

function buildUpdateFields(userInput) {
    const updateFields = {};
    
    // Process basic fields
    const basicFields = ['firstName', 'lastName', 'username', 'email', 'phoneNumber'];
    basicFields.forEach(field => {
        if (userInput[field] && userInput[field].trim() !== "") {
            updateFields[field] = field === 'username' 
                ? sanitizeInput(userInput[field]).toLowerCase() 
                : sanitizeInput(userInput[field]);
        }
    });

    // Process address if provided
    if (userInput.address && typeof userInput.address === 'object') {
        const sanitizedAddress = {};
        const addressFields = ['line1', 'line2', 'city', 'state', 'zipcode'];
        
        addressFields.forEach(field => {
            if (userInput.address[field]) {
                sanitizedAddress[field] = sanitizeInput(userInput.address[field]);
            }
        });

        if (Object.keys(sanitizedAddress).length > 0) {
            updateFields.address = sanitizedAddress;
        }
    }
    
    return updateFields;
}

async function handlePasswordUpdate(newPassword, currentPasswordHash) {
    const passwordMatches = await bcrypt.compare(newPassword, currentPasswordHash);
    if (passwordMatches) {
        logger.warn("New password cannot be the same as the current password.");
        return {
            error: true,
            response: new Response(
                JSON.stringify({ message: "New password cannot be the same as the current password." }), 
                { status: 400 }
            )
        };
    }
    
    return {
        error: false,
        hashedPassword: await bcrypt.hash(newPassword, 10)
    };
}

async function checkUsernameUniqueness(collection, username, userId) {
    const duplicateUser = await collection.findOne({
        username: username,
        _id: { $ne: userId }
    });
    
    if (duplicateUser) {
        logger.warn("Username is already taken.");
        return {
            error: true,
            response: new Response(
                JSON.stringify({ message: "Username is already taken." }), 
                { status: 400 }
            )
        };
    }
    
    return { error: false };
}

async function updateUserAndRespond(collection, userId, updateFields) {
    const result = await collection.updateOne(
        { _id: userId },
        { $set: updateFields }
    );

    if (result.modifiedCount === 0) {
        logger.warn("No changes were made to the user.");
        return new Response(JSON.stringify({ message: "No changes made" }), { status: 400 });
    }

    const updatedUser = await collection.findOne({ _id: userId });
    if (updatedUser) {
        delete updatedUser.password;
    }

    return new Response(JSON.stringify({ message: "Update successful", user: updatedUser }), { status: 200 });
}

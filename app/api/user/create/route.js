import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
//import BonsaiLogger from "../../../lib/bonsailogger.js";
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd()); 


const uri = process.env.MONGODB_URI;

export async function POST(req) {
    try {
        // Check if the request contains an Authorization header with a Bearer token
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            return new Response(JSON.stringify({ message: "Authorization header missing" }), { status: 403 });
        }

        const token = authHeader.split(" ")[1];  // Extract token from Bearer token
        if (!token) {
            return new Response(JSON.stringify({ message: "Token missing" }), { status: 403 });
        }

        // Verify the token using the verifyToken function
        let decoded;
        try {
            decoded = verifyToken(token);  // Decodes the JWT and returns the payload
        } catch (error) {
            return new Response(JSON.stringify({ message: "Invalid or expired token" }), { status: 403 });
        }

        // If the token is valid, the user is authenticated and we can proceed
        console.log("Authenticated user:", decoded);

        // Proceed with user creation logic
        const { user } = await req.json();

        if (!user) {
            //await BonsaiLogger("ERROR: User data is required!");
            return new Response(JSON.stringify({ message: "User data is required!" }), { status: 400 });
        }

        const client = new MongoClient(uri);
        await client.connect();
        const database = client.db("niibish-aki");
        const collection = database.collection("users");

        // Check if user already exists
        const existingUser = await collection.findOne({
            $or: [{ username: user.username }, { email: user.email }]
        });

        if (existingUser) {
            //await BonsaiLogger(`WARNING: Username or email already exists! User: ${user.username}`);
            return new Response(JSON.stringify({ message: "Username or email already exists!" }), { status: 409 });
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(user.password, 10);

        const dbResponse = await collection.insertOne({
            ...user,
            password: hashedPassword,
        });

        await client.close();

        if (!dbResponse.acknowledged) {
            //await BonsaiLogger("ERROR: Failed to save user!");
            return new Response(JSON.stringify({ message: "User not saved!" }), { status: 500 });
        }

        //await BonsaiLogger(`INFO: User created successfully! ID: ${dbResponse.insertedId}`);
        return new Response(JSON.stringify({ message: "User saved successfully!" }), { status: 201 });

    } catch (error) {
        //await BonsaiLogger(`ERROR: MongoDB connection error - ${error.message}`);
        return new Response(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}

export async function GET() {
    //await BonsaiLogger("INFO: GET request received at postCreateUser endpoint");
    return new Response(JSON.stringify({ message: "You've hit the postCreateUser endpoint" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
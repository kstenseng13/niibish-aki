import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
//import BonsaiLogger from "../../../lib/bonsailogger.js";
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd()); 

const uri = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
    try {
        const { username, password } = await req.json();

        const client = new MongoClient(uri);
        await client.connect();
        const database = client.db("niibish-aki");
        const collection = database.collection("users");

        // Find user by username
        const user = await collection.findOne({ username });

        if (!user) {
            //await BonsaiLogger(`WARNING: Login failed for username: ${username}`);
            return new Response(JSON.stringify({ message: "Invalid username or password" }), { status: 401 });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            //await BonsaiLogger(`WARNING: Incorrect password for username: ${username}`);
            return new Response(JSON.stringify({ message: "Invalid username or password" }), { status: 401 });
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: "7d" });

        await client.close();

        //await BonsaiLogger(`INFO: User logged in: ${username}`);
        return new Response(JSON.stringify({ message: "Login successful", token }), { status: 200 });

    } catch (error) {
        //await BonsaiLogger(`ERROR: Login error - ${error.message}`);
        return new Response(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}

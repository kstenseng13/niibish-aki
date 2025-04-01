'use server';

import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import logToElasticsearch from "@/lib/logger"; // Import your logging function

dotenv.config();

const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { user } = req.body;

        if (!user) {
            await logToElasticsearch("ERROR: User data is required!");
            return res.status(400).json({ message: "User data is required!" });
        }

        const client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        try {
            await client.connect();
            const database = client.db("niibish-aki");
            const collection = database.collection("users");

            const existingUser = await collection.findOne({ 
                $or: [{ username: user.username }, { email: user.email }] 
            });

            if (existingUser) {
                await logToElasticsearch(`WARNING: Username or email already exists! User: ${user.username}`);
                return res.status(409).json({ message: "Username or email already exists!" });
            }

            const dbResponse = await collection.insertOne(user);
            if (!dbResponse.acknowledged) {
                await logToElasticsearch("ERROR: Failed to save user!");
                return res.status(500).json({ message: "User not saved!" });
            }

            await logToElasticsearch(`INFO: User created successfully! ID: ${dbResponse.insertedId}`);
            res.status(201).json({ message: "User saved successfully!" });

        } catch (error) {
            await logToElasticsearch(`ERROR: MongoDB connection error - ${error.message}`);
            res.status(500).json({ message: "Something went wrong!" });
        } finally {
            await client.close();
        }
    } else if (req.method === "GET") {
        await logToElasticsearch("INFO: GET request received at postCreateUser endpoint");
        res.status(200).json({ message: "You've hit the postCreateUser endpoint" });
    } else {
        await logToElasticsearch(`WARNING: Method not allowed - ${req.method}`);
        res.status(405).json({ message: "Method not allowed!" });
    }
}

import { MongoClient, ObjectId } from "mongodb";
import { loadEnvConfig } from "@next/env";
import logger from "@/lib/dnaLogger";

loadEnvConfig(process.cwd());
const uri = process.env.MONGODB_URI;

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri);
  await client.connect();
  logger.info("Connected to MongoDB.");

  const db = client.db("niibish-aki");

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function getCollection(collectionName) {
  const { db } = await connectToDatabase();
  return db.collection(collectionName);
}

export async function closeConnection() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    logger.info("Closed MongoDB connection.");
  }
}

export function createObjectId(id) {
  try {
    return new ObjectId(String(id));
  } catch (error) {
    logger.error(`Invalid ObjectId format: ${id}`, error);
    throw new Error(`Invalid ObjectId format: ${id}`);
  }
}

export function isValidObjectId(id) {
  return ObjectId.isValid(id);
}

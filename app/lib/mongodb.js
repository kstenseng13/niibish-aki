import { MongoClient, ObjectId } from "mongodb";
import { loadEnvConfig } from "@next/env";
import logger from "@/lib/dnaLogger";

loadEnvConfig(process.cwd());
const uri = process.env.MONGODB_URI;

// In dev, create a new client for each request to avoid connection leaks
// In prod, use connection pooling with a cached client
const isDevelopment = process.env.NODE_ENV === 'development';
let cachedClient = null;
let cachedDb = null;
let connectionCounter = 0;

export async function connectToDatabase() {
  // In dev, create a new connection each time to avoid leaks during hot reloading
  if (isDevelopment || !cachedClient || !cachedDb) {
    const client = new MongoClient(uri);
    await client.connect();
    connectionCounter++;
    logger.info(`Connected to MongoDB. Active connections: ${connectionCounter}`);

    const db = client.db("niibish-aki");

    // In dev, don't cache the connection
    if (!isDevelopment) {
      cachedClient = client;
      cachedDb = db;
    }

    return { client, db };
  }

  // In prod, reuse the cached connection
  return { client: cachedClient, db: cachedDb };
}

export async function getCollection(collectionName) {
  const { db } = await connectToDatabase();
  return db.collection(collectionName);
}


export async function closeConnection(client) {
  if (client) {
    await client.close();
    connectionCounter--;
    logger.info(`Closed specific MongoDB connection. Active connections: ${connectionCounter}`);
    return;
  }

  // In dev, close the cached client if it exists
  if (isDevelopment && cachedClient) {
    await cachedClient.close();
    connectionCounter--;
    cachedClient = null;
    cachedDb = null;
    logger.info(`Closed cached MongoDB connection. Active connections: ${connectionCounter}`);
  } else if (!isDevelopment) {
    // In prod, log but don't actually close the connection to maintain the pool
    logger.info("Connection maintained in connection pool.");
  }
}

/**
 * Create a MongoDB ObjectId from a string
 */
export function createObjectId(id) {
  try {
    return new ObjectId(String(id));
  } catch (error) {
    logger.error(`Invalid ObjectId format: ${id}`, error);
    throw new Error(`Invalid ObjectId format: ${id}`);
  }
}

/**
 * Check if a string is a valid MongoDB ObjectId
 */
export function isValidObjectId(id) {
  return ObjectId.isValid(id);
}

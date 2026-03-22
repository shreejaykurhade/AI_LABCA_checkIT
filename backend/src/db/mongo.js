const { MongoClient } = require('mongodb');

let client;
let db;
let isConnected = false;

async function connectDB() {
  if (db) return db;

  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
  client = new MongoClient(uri, { serverSelectionTimeoutMS: 2000 }); // Fast fail

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db(process.env.DB_NAME || "indian_fact_checker");
    isConnected = true;
    return db;
  } catch (error) {
    console.warn("⚠️ MongoDB connection failed. Switching to In-Memory mode.");
    console.warn("Error:", error.message);
    isConnected = false;
    return null; // Fallback
  }
}

function getDB() {
  if (!isConnected) return null;
  return db;
}

module.exports = { connectDB, getDB };

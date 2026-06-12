import mongoose from "mongoose";

const MONGO_URI = process.env.CONNECTION_STRING || "";

if (!MONGO_URI) {
  throw new Error("❌ CONNECTION_STRING is missing");
}

// Global cache for Vercel serverless
let cached = (global as any).mongooseCache;

if (!cached) {
  cached = (global as any).mongooseCache = {
    conn: null,
    promise: null,
  };
}

export async function connectToDatabase() {
  // If already connected → reuse it
  if (cached.conn) {
    return cached.conn;
  }

  // If connection is not started yet → start it once
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
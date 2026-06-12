import mongoose from "mongoose";

let cached = (global as any).mongooseCache;

if (!cached) {
  cached = (global as any).mongooseCache = {
    conn: null,
    promise: null,
  };
}
export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.CONNECTION_STRING as string);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
import dotenv from "dotenv";
dotenv.config();

import app from "../app";
import { connectToDatabase } from "../mongodb";

let cached = (global as any).mongooseCache || {
  conn: false,
};

(global as any).mongooseCache = cached;

export default async function handler(req: any, res: any) {
  try {
    if (!cached.conn) {
     await connectToDatabase();
    }

    return app(req, res);
  } catch (error) {
    console.error("❌ DB error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
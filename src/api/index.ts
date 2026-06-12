import dotenv from "dotenv";
dotenv.config();

import serverless from "serverless-http";
import app from "../app";
import { connectToDatabase } from "../mongodb";

let cached = (global as any).mongooseCache || {
  conn: false,
};

(global as any).mongooseCache = cached;

const handler = serverless(app);


export default async function (req: any, res: any) {
  try {
    if (!cached.conn) {
      await connectToDatabase();
      cached.conn = true;
    }

     return handler(req, res);
  } catch (error) {
    console.error("❌ DB error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
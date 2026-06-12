declare const process: any;

import { connectToDatabase } from "../src/mongodb";
import { runSubscriptionJob } from "../src/jobs/subscriptionJob";

export default async function handler(req: any, res: any) {
  try {
    await connectToDatabase(process.env.CONNECTION_STRING || "");

    const result = await runSubscriptionJob();

    return res.status(200).json({
      success: true,
      modified: result.modifiedCount,
    });
  } catch (error) {
    return res.status(500).json({
      error: "cron failed",
    });
  }
}
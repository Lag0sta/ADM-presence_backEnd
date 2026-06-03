import cron from "node-cron";
import Students from "../models/students";

export function startSubscriptionCron() {
  cron.schedule("* * * * *", async () => {
    const now = new Date();

    await Students.updateMany(
      {
        subscription: "trimestriel",
        endDate: { $lte: now }
      },
      
      {
        $set: {
          subscription: null,
          startDate: null,
          endDate: null
        }
      }
    );
  });
}
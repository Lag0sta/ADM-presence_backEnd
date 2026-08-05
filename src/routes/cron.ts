import { Router } from "express";
import { runSubscriptionJob } from "../jobs/subscriptionJob";

const router = Router();

router.get("/subscription-cron", async (_req, res) => {
  const result = await runSubscriptionJob();

  res.json({
    success: true,
    modified: result.modifiedCount,
  });
});

export default router;
import Student from "../models/students";

export async function runSubscriptionJob() {
  const now = new Date();

   const result = await Student.updateMany(
    {
      "subscription.plan": "trimestriel",
      "subscription.endDate": { $lte: now }
    },
    {
      $set: {
        "subscription.plan": null,
        "subscription.startDate": null,
        "subscription.endDate": null,
      }
    }
  );

return result;
}
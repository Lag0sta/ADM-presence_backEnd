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
        subscription: null,
        startDate: null,
        endDate: null
      }
    }
  );

  return result;
}
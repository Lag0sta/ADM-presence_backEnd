export function getSubscriptionPeriod(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();

  // Trouver le début du trimestre (0, 3, 6, 9)
  const startMonth = Math.floor(month / 3) * 3;

  const startDate = new Date(year, startMonth, 1);

  const endDate = new Date(year, startMonth + 3, 1);

  return {
    startDate,
    endDate,
  };
}
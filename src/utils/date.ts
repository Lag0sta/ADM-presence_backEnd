export function getQuarterlySubscriptionPeriod(date = new Date()) {
  
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

export function getAnnualSubscriptionPeriod(date = new Date()) {
  
  const year = date.getFullYear();
  const month = date.getMonth();

  // Trouver le début du trimestre (0, 3, 6, 9)
  const startMonth = Math.floor(month / 3) * 3; 
  const startDate = new Date(year, startMonth, 1);

  // Fin de l'abonnement annuel au 1er juillet
  const endYear = month < 6 ? year : year + 1;
  const endDate = new Date(endYear, 6, 1);

  return {
    startDate,
    endDate,
  };
}
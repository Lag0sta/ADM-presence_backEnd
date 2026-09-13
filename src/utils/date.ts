export function getQuarterlySubscriptionPeriod(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();

  let startMonth;

  if (month >= 8 && month <= 10) {
    // Septembre - Novembre
    startMonth = 8;
  } else if (month >= 11 || month <= 1) {
    // Décembre - Février
    startMonth = 11;
  } else if (month >= 2 && month <= 4) {
    // Mars - Mai
    startMonth = 2;
  } else {
    // Juin - Août
    startMonth = 5;
  }

  const startYear = startMonth === 11 && month <= 1
    ? year - 1
    : year;

  const startDate = new Date(startYear, startMonth, 1);
  const endDate = new Date(startYear, startMonth + 3, 1);

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
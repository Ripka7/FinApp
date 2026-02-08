
/**
 * DEPRECATED: This file is removed as the app is now 100% autonomous.
 * Local heuristics are now handled directly within the components.
 */
export const getLocalFinancialTip = (wallets: any[], transactions: any[]): string => {
  const tips = [
    "Consider moving 10% of your idle cash to your 'New Car' envelope.",
    "You've spent 80% of your 'Food' budget. Try home cooking this week.",
    "Gold is a great hedge against inflation. Check your physical assets.",
    "Emergency funds should ideally cover 3-6 months of expenses.",
    "Diversification is key: don't keep all your savings in a single currency.",
    "Review your recurring subscriptions; are you still using all of them?",
    "Small daily expenses add up. Track your coffee and snacks today."
  ];
  return tips[Math.floor(Math.random() * tips.length)];
};

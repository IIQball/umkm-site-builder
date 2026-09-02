export interface WalletMutationItem {
  type: string;
  createdAt: Date | string;
  amount: number;
  description: string;
}

export const buildWeeklyData = (mutations: WalletMutationItem[]) => {
  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const dayLabel = days[d.getDay()];
    const dayStr = d.toISOString().slice(0, 10);
    const amount = mutations
      .filter((m) => m.type === 'CREDIT' && String(m.createdAt).slice(0, 10) === dayStr)
      .reduce((s, m) => s + m.amount, 0);
    return { label: dayLabel, amount, isToday: i === 6 };
  });
};

export const buildDistribution = (mutations: WalletMutationItem[]) => {
  const creditMuts = mutations.filter((m) => m.type === 'CREDIT');
  if (creditMuts.length === 0) return [];
  const totalCredit = creditMuts.reduce((s, m) => s + m.amount, 0) || 1;
  const grouped: Record<string, number> = {};
  for (const m of creditMuts) {
    grouped[m.description] = (grouped[m.description] ?? 0) + m.amount;
  }
  return Object.entries(grouped)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, amt], i) => {
      const cleanName = name.replace(/^Komisi Penjualan Template:\s*/i, '');
      return {
        name: cleanName,
        amount: amt,
        pct: Math.round((amt / totalCredit) * 100),
        color: ['bg-primary', 'bg-secondary', 'bg-info'][i],
      };
    });
};

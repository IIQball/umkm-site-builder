export interface GrowthFilter {
  year: number;
  month?: number | 'all';
}

export interface FeeRevenueRecord {
  amount: number;
  createdAt: Date | string;
}

export interface FeeRevenuePoint {
  monthKey: string;
  label: string;
  fullLabel: string;
  amount: number;
  cumulative: number;
  x: number;
  y: number;
}

export interface FeeRevenueSummary {
  totalRevenue: number;
  thisMonthRevenue: number;
  lastMonthRevenue: number;
  growthPercentage: number;
  isPositiveGrowth: boolean;
  points: FeeRevenuePoint[];
  svgLinePath: string;
  svgAreaPath: string;
  maxVal: number;
  baselineY: number;
  padLeft: number;
  padTop: number;
  svgWidth: number;
  svgHeight: number;
  usableWidth: number;
  usableHeight: number;
  periodLabel: string;
  filterMode: 'month' | 'day';
}

export interface GrowthFilter {
  year: number;
  month?: number | 'all';
}

export interface MerchantRegistrationRecord {
  id: string;
  createdAt: Date | string;
}

export interface MerchantGrowthPoint {
  monthKey: string;
  label: string;
  fullLabel: string;
  newCount: number;
  cumulative: number;
  x: number;
  y: number;
}

export interface MerchantGrowthSummary {
  totalMerchants: number;
  thisMonthNew: number;
  lastMonthNew: number;
  growthPercentage: number;
  isPositiveGrowth: boolean;
  points: MerchantGrowthPoint[];
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

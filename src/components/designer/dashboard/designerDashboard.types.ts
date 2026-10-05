export interface DesignerTemplateRecord {
  id: string;
  name: string;
  slug: string;
  thumbnailUrl?: string | null;
  price: number;
  status: string;
  createdAt: string | Date;
  categoryName?: string | null;
}

export interface DesignerCommissionRecord {
  id: string;
  templateId: string;
  totalAmount: number;
  designerAmount: number;
  platformFee: number;
  createdAt: string | Date;
}

export interface GrowthPoint {
  monthKey: string;
  label: string;
  fullLabel: string;
  count: number;
  cumulative: number;
  x: number;
  y: number;
}

export interface DesignerGrowthSummary {
  totalCount: number;
  thisMonthCount: number;
  lastMonthCount: number;
  growthPercentage: number;
  isPositiveGrowth: boolean;
  points: GrowthPoint[];
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

export interface GrowthFilter {
  year: number;
  month?: number | 'all';
}

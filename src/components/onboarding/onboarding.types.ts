export interface TemplateItem {
  id: string;
  name: string;
  description: string | null;
  thumbnailUrl: string | null;
  price: number;
  slug?: string;
  categoryName?: string | null;
  isOwned?: boolean;
}

export type OnboardingStep = 1 | 2 | 3 | 4;

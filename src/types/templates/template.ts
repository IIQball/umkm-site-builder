/**
 * Template & Builder Types
 */

import type { z } from 'zod';
import type {
  TemplateConfigSchema,
  TemplateSectionSchema,
  TemplateThemeSchema,
  TemplateDraftCreateSchema,
  TemplateDraftUpdateSchema,
  TemplateDraftSubmitSchema,
} from '@/schemas';

export type TemplateConfig = z.infer<typeof TemplateConfigSchema>;
export type TemplateSection = z.infer<typeof TemplateSectionSchema>;
export type TemplateTheme = z.infer<typeof TemplateThemeSchema>;
export type TemplateDraftCreateInput = z.infer<typeof TemplateDraftCreateSchema>;
export type TemplateDraftUpdateInput = z.infer<typeof TemplateDraftUpdateSchema>;
export type TemplateDraftSubmitInput = z.infer<typeof TemplateDraftSubmitSchema>;

export type TemplateStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export interface TemplateRecord {
  id: string;
  name: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  price: number;
  config: TemplateConfig;
  status: TemplateStatus;
  designerId: string;
  approvedBy?: string | null;
  rejectionReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicTemplateItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  thumbnailUrl: string | null;
  status: TemplateStatus;
  createdAt: Date;
  designerName: string;
}

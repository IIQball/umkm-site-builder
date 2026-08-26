/**
 * Template Section Content & Items Types
 */

export interface FAQItem {
  question?: string;
  answer?: string;
  category?: string;
}

export interface FeatureItem {
  icon?: string;
  title?: string;
  description?: string;
}

export interface ProductItem {
  id?: string;
  name?: string;
  price?: number;
  image?: string;
  imageUrl?: string;
  badge?: string;
  category?: string;
}

export interface TestimonialItem {
  avatar?: string;
  customerName?: string;
  rating?: number;
  comment?: string;
}

export interface AdminTemplateItem {
  id: string;
  name: string;
  description: string | null;
  thumbnailUrl: string | null;
  price: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'pending_review';
  rejectionReason: string | null;
  createdAt: string;
  designerId: string;
  designerName: string | null;
  designerEmail: string | null;
}

export interface DesignerTemplateListItem {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  thumbnailUrl?: string | null;
  status: string;
  rejectionReason?: string | null;
  createdAt?: Date | string;
  updatedAt?: string;
  authorId?: string;
  totalSold?: number;
}

export type TemplateItem = DesignerTemplateListItem;

export type ThemeTab = 'colors' | 'typography' | 'buttons' | 'layout' | 'radius' | 'spacing';

export interface NodeOption {
  type: string;
  label: string;
  id?: string;
  icon?: unknown;
  description?: string;
}

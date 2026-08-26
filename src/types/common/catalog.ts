/**
 * Product Catalog Common Types
 */

export interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  storeId?: string;
  sortOrder?: number;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductVariant {
  name: string;
  price?: number;
}

export interface Product {
  id: string;
  storeId?: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  slug: string;
  description: string | null;
  basePrice: number;
  imageUrls: string[] | unknown;
  variants: ProductVariant[] | unknown;
  sortOrder: number;
  isActive?: boolean;
  isAvailable?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type PublicTemplate = {
  id: string;
  name: string;
  description: string | null;
  thumbnailUrl: string | null;
  price: number;
  status: string;
  createdAt: string | Date;
  categoryId: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  categoryIcon: string | null;
  designerName: string | null;
};

export type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
};

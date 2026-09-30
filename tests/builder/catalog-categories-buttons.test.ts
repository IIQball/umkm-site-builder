import { describe, it, expect } from 'vitest';
import {
  DEFAULT_CATALOG_CATEGORIES,
  DEFAULT_DEMO_PRODUCTS,
  type CatalogCategory,
} from '@/components/builder/sections/productCatalog.helpers';

describe('Product Catalog Categories & Button Text Configuration', () => {
  it('DEFAULT_CATALOG_CATEGORIES has predefined categories with valid id, name, and slug', () => {
    expect(DEFAULT_CATALOG_CATEGORIES.length).toBeGreaterThan(0);
    for (const cat of DEFAULT_CATALOG_CATEGORIES) {
      expect(cat.id).toBeDefined();
      expect(cat.name).toBeTruthy();
      expect(cat.slug).toBeTruthy();
    }
  });

  it('DEFAULT_DEMO_PRODUCTS are mapped to default categories', () => {
    expect(DEFAULT_DEMO_PRODUCTS.length).toBeGreaterThanOrEqual(3);
    expect(DEFAULT_DEMO_PRODUCTS[0].categoryId).toBe('cat_makanan');
    expect(DEFAULT_DEMO_PRODUCTS[0].categoryName).toBe('Makanan & Snack');
    expect(DEFAULT_DEMO_PRODUCTS[1].categoryId).toBe('cat_minuman');
    expect(DEFAULT_DEMO_PRODUCTS[2].categoryId).toBe('cat_kriya');
  });

  it('filters products correctly by category id or fallback category name', () => {
    const selectedCatId = 'cat_makanan';
    const filtered = DEFAULT_DEMO_PRODUCTS.filter(
      (p) => p.categoryId === selectedCatId || p.categoryName === 'Makanan & Snack'
    );
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered[0].id).toBe(DEFAULT_DEMO_PRODUCTS[0].id);
  });

  it('can dynamically add and remove categories', () => {
    const categories: CatalogCategory[] = [...DEFAULT_CATALOG_CATEGORIES];
    const newCat: CatalogCategory = {
      id: 'cat-fashion',
      name: 'Fashion & Aksesoris',
      slug: 'fashion-aksesoris',
    };
    const updated = [...categories, newCat];
    expect(updated.length).toBe(categories.length + 1);
    expect(updated.find((c) => c.id === 'cat-fashion')?.name).toBe('Fashion & Aksesoris');

    const filtered = updated.filter((c) => c.id !== 'cat-fashion');
    expect(filtered.length).toBe(categories.length);
  });
});

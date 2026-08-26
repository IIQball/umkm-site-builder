import type { Product } from '@/types/common';

export function parseProductVariants(variantsText: string): Array<{ name: string; price: number }> {
  if (!variantsText.trim()) return [];
  return variantsText
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
    .map((name) => ({ name, price: 0 }));
}

export function formatInitialVariantsText(product: Product | null): string {
  if (!product || !Array.isArray(product.variants)) return '';
  return product.variants
    .map((v: unknown) => {
      if (typeof v === 'object' && v !== null && 'name' in v) {
        return String((v as { name: string }).name);
      }
      return JSON.stringify(v);
    })
    .join(', ');
}

export async function submitProductForm(
  storeId: string,
  editingProduct: Product | null,
  payload: {
    name: string;
    categoryId: string;
    basePrice: number;
    description: string;
    isAvailable: boolean;
    sortOrder: number;
    imageUrls: string[];
    variants: Array<{ name: string; price: number }>;
  },
) {
  const url = editingProduct
    ? `/api/products/${editingProduct.id}?storeId=${storeId}`
    : `/api/products?storeId=${storeId}`;
  const method = editingProduct ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Gagal menyimpan produk');
  }

  return res.json();
}

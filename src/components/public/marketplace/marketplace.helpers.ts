import type { PublicTemplate } from '../marketplace.types';

export const filterTemplates = (
  templates: PublicTemplate[],
  selectedCategorySlug: string,
  selectedPriceFilter: string,
  searchQuery: string,
  selectedSort: string
): PublicTemplate[] => {
  return templates
    .filter((tpl) => {
      // 1. Category Filter
      if (selectedCategorySlug !== 'all') {
        if (tpl.categorySlug !== selectedCategorySlug) return false;
      }

      // 2. Price Filter
      if (selectedPriceFilter === 'free') {
        if (tpl.price !== 0) return false;
      } else if (selectedPriceFilter === 'paid') {
        if (tpl.price <= 0) return false;
      } else if (selectedPriceFilter === 'under50') {
        if (tpl.price <= 0 || tpl.price > 50000) return false;
      } else if (selectedPriceFilter === '50to100') {
        if (tpl.price < 50000 || tpl.price > 100000) return false;
      } else if (selectedPriceFilter === 'above100') {
        if (tpl.price <= 100000) return false;
      }

      // 3. Search Query
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchName = tpl.name.toLowerCase().includes(q);
        const matchDesc = tpl.description ? tpl.description.toLowerCase().includes(q) : false;
        const matchDesigner = tpl.designerName ? tpl.designerName.toLowerCase().includes(q) : false;
        const matchCategory = tpl.categoryName ? tpl.categoryName.toLowerCase().includes(q) : false;
        if (!matchName && !matchDesc && !matchDesigner && !matchCategory) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (selectedSort === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (selectedSort === 'price_asc') {
        return a.price - b.price;
      }
      if (selectedSort === 'price_desc') {
        return b.price - a.price;
      }
      if (selectedSort === 'name_asc') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
};

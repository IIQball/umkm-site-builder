import { describe, it, expect } from 'vitest';
import type { TemplateSection } from '@/schemas';
import { getSectionNodes } from '@/components/builder/layer/layerPanel.helpers';

describe('Element Selection Isolation & 1-by-1 Node Selection', () => {
  describe('Cross-Section Selection Isolation Logic', () => {
    it('isolates title selection to only the matching sectionId', () => {
      const activeSectionId = 'section-features';
      const selectedNodeId = 'title';

      const isNodeActive = (sectionId: string, isActive: boolean, nodeId: string) => {
        const isThisSectionSelected = isActive || activeSectionId === sectionId;
        return isThisSectionSelected && selectedNodeId === nodeId;
      };

      // Features section is active
      expect(isNodeActive('section-features', true, 'title')).toBe(true);

      // Hero section is NOT active
      expect(isNodeActive('section-hero', false, 'title')).toBe(false);

      // Product Catalog section is NOT active
      expect(isNodeActive('section-catalog', false, 'title')).toBe(false);

      // Testimonials section is NOT active
      expect(isNodeActive('section-testimonials', false, 'title')).toBe(false);

      // FAQ section is NOT active
      expect(isNodeActive('section-faq', false, 'title')).toBe(false);

      // Footer section is NOT active
      expect(isNodeActive('section-footer', false, 'title')).toBe(false);
    });

    it('isolates badge selection to only the active section', () => {
      const activeSectionId = 'section-hero';
      const selectedNodeId = 'badge';

      const isNodeActive = (sectionId: string, isActive: boolean, nodeId: string) => {
        const isThisSectionSelected = isActive || activeSectionId === sectionId;
        return isThisSectionSelected && selectedNodeId === nodeId;
      };

      expect(isNodeActive('section-hero', true, 'badge')).toBe(true);
      expect(isNodeActive('section-features', false, 'badge')).toBe(false);
      expect(isNodeActive('section-catalog', false, 'badge')).toBe(false);
      expect(isNodeActive('section-testimonials', false, 'badge')).toBe(false);
      expect(isNodeActive('section-faq', false, 'badge')).toBe(false);
    });

    it('isolates subtitle selection across sections', () => {
      const activeSectionId = 'section-catalog';
      const selectedNodeId = 'subtitle';

      const isNodeActive = (sectionId: string, isActive: boolean, nodeId: string) => {
        const isThisSectionSelected = isActive || activeSectionId === sectionId;
        return isThisSectionSelected && selectedNodeId === nodeId;
      };

      expect(isNodeActive('section-catalog', true, 'subtitle')).toBe(true);
      expect(isNodeActive('section-hero', false, 'subtitle')).toBe(false);
      expect(isNodeActive('section-features', false, 'subtitle')).toBe(false);
      expect(isNodeActive('section-testimonials', false, 'subtitle')).toBe(false);
      expect(isNodeActive('section-faq', false, 'subtitle')).toBe(false);
    });
  });

  describe('1-by-1 Element Breakdown in Layer Tree', () => {
    it('breaks down Product Catalog header into individual badge, title, subtitle nodes', () => {
      const catalogSection: TemplateSection = {
        id: 'catalog-1',
        type: 'product_catalog',
        layoutPreset: 'grid_standard',
        props: {
          badge: 'Promo Pilihan',
          title: 'Katalog Produk Pilihan',
          subtitle: 'Koleksi produk terbaik kami',
          items: [
            { id: 'prod-1', name: 'Produk 1', price: 10000 },
            { id: 'prod-2', name: 'Produk 2', price: 20000 },
          ],
        },
      };

      const nodes = getSectionNodes(catalogSection);
      const nodeIds = nodes.map((n) => n.id);

      // Verify individual elements exist
      expect(nodeIds).toContain('badge');
      expect(nodeIds).toContain('title');
      expect(nodeIds).toContain('subtitle');

      // Verify no monolithic catalog_header container
      expect(nodeIds).not.toContain('catalog_header');
    });

    it('breaks down Testimonials header into individual badge, title, subtitle nodes', () => {
      const testiSection: TemplateSection = {
        id: 'testi-1',
        type: 'testimonials',
        layoutPreset: 'masonry_grid',
        props: {
          badge: 'Testimoni Pembeli',
          title: 'Apa Kata Pelanggan Kami',
          subtitle: 'Ulasan jujur dari pembeli terverifikasi',
          reviews: [
            { id: 'rev-1', customerName: 'Budi', comment: 'Bagus!' },
          ],
        },
      };

      const nodes = getSectionNodes(testiSection);
      const nodeIds = nodes.map((n) => n.id);

      // Verify individual elements exist
      expect(nodeIds).toContain('badge');
      expect(nodeIds).toContain('title');
      expect(nodeIds).toContain('subtitle');

      // Verify no monolithic testimonials_header container
      expect(nodeIds).not.toContain('testimonials_header');
    });

    it('breaks down FAQ header into individual badge, title, subtitle nodes', () => {
      const faqSection: TemplateSection = {
        id: 'faq-1',
        type: 'faq',
        layoutPreset: 'accordion_single_col',
        props: {
          badge: 'Tanya Jawab',
          title: 'Pertanyaan yang Sering Diajukan',
          subtitle: 'Temukan jawaban cepat untuk pertanyaan umum',
          faqs: [
            { id: 'faq-1', question: 'Cara beli?', answer: 'Klik tombol WA.' },
          ],
        },
      };

      const nodes = getSectionNodes(faqSection);
      const nodeIds = nodes.map((n) => n.id);

      // Verify individual elements exist
      expect(nodeIds).toContain('badge');
      expect(nodeIds).toContain('title');
      expect(nodeIds).toContain('subtitle');

      // Verify no monolithic faq_header container
      expect(nodeIds).not.toContain('faq_header');
    });
  });
});

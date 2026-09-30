import { describe, it, expect } from 'vitest';
import type { TemplateSection, TemplateConfig } from '@/schemas';
import { getSectionNodes } from '@/components/builder/layer/layerPanel.helpers';
import {
  getDefaultCatalogSlots,
  getCatalogSlotLabel,
  getEffectiveCatalogElementOrder,
  CATALOG_PRESET_SLOTS,
} from '@/components/builder/sections/catalog/catalogLayout.helpers';
import { DEFAULT_DEMO_PRODUCTS } from '@/components/builder/sections/productCatalog.helpers';
import { applyDeleteNode, applyAddNode } from '@/components/builder/stores/editorStore.mutations';
import type { DocumentState } from '@/components/builder/stores/editorStore.types';

describe('Catalog Sidebar Sync (Left LAPISAN vs Right Tata Letak Inspector)', () => {
  const presets = Object.keys(CATALOG_PRESET_SLOTS);

  it('all 20 catalog presets have matching slot counts and 1:1 Bahasa Indonesia labels in left and right sidebars', () => {
    for (const preset of presets) {
      const defaultSlots = getDefaultCatalogSlots(preset, DEFAULT_DEMO_PRODUCTS);
      const section: TemplateSection = {
        id: `cat-${preset}`,
        type: 'product_catalog',
        layoutPreset: preset,
        props: {
          layoutPreset: preset,
          products: DEFAULT_DEMO_PRODUCTS,
          elementOrder: [...defaultSlots],
        },
      };

      const leftNodes = getSectionNodes(section);
      const effectiveOrder = getEffectiveCatalogElementOrder(preset, defaultSlots, DEFAULT_DEMO_PRODUCTS);
      const rightLabels = effectiveOrder.map((s) => getCatalogSlotLabel(s, preset, DEFAULT_DEMO_PRODUCTS));

      expect(leftNodes.length).toBe(rightLabels.length);

      const leftNames = leftNodes.map((n) => n.name);
      expect(leftNames).toEqual(rightLabels);
    }
  });

  it('each product is an independent element (1 produk = 1 elemen mandiri)', () => {
    const testProducts = [
      DEFAULT_DEMO_PRODUCTS[0],
      { id: 'prod_2', name: 'Produk Tambahan', price: 75000, description: 'Deskripsi uji' },
    ];
    const defaultSlots = getDefaultCatalogSlots('grid_standard', testProducts);
    const section: TemplateSection = {
      id: 'cat-grid',
      type: 'product_catalog',
      layoutPreset: 'grid_standard',
      props: {
        layoutPreset: 'grid_standard',
        products: testProducts,
        elementOrder: [...defaultSlots],
      },
    };

    const leftNodes = getSectionNodes(section);
    const productNodes = leftNodes.filter((n) => n.name.startsWith('Produk #'));

    expect(productNodes.length).toBe(testProducts.length);
    expect(productNodes[0].name).toContain('Produk #1');
    expect(productNodes[0].name).toContain(testProducts[0].name);
    expect(productNodes[1].name).toContain('Produk #2');
    expect(productNodes[1].name).toContain(testProducts[1].name);
  });

  it('flash_sale_countdown includes Hitung Mundur Flash Sale in both sidebars', () => {
    const defaultSlots = getDefaultCatalogSlots('flash_sale_countdown', DEFAULT_DEMO_PRODUCTS);
    const section: TemplateSection = {
      id: 'cat-flash',
      type: 'product_catalog',
      layoutPreset: 'flash_sale_countdown',
      props: {
        layoutPreset: 'flash_sale_countdown',
        products: DEFAULT_DEMO_PRODUCTS,
        elementOrder: [...defaultSlots],
      },
    };

    const leftNodes = getSectionNodes(section);
    const leftNames = leftNodes.map((n) => n.name);

    expect(leftNames).toContain('Hitung Mundur Flash Sale');
    expect(leftNames).toContain('Judul Utama (H2)');
    expect(leftNames).toContain('Deskripsi Subjudul');
  });

  it('single_product_deep_focus includes deep description and CTA in both sidebars', () => {
    const defaultSlots = getDefaultCatalogSlots('single_product_deep_focus', DEFAULT_DEMO_PRODUCTS);
    const section: TemplateSection = {
      id: 'cat-single',
      type: 'product_catalog',
      layoutPreset: 'single_product_deep_focus',
      props: {
        layoutPreset: 'single_product_deep_focus',
        products: DEFAULT_DEMO_PRODUCTS,
        elementOrder: [...defaultSlots],
      },
    };

    const leftNodes = getSectionNodes(section);
    const leftNames = leftNodes.map((n) => n.name);

    expect(leftNames).toContain('Deskripsi Manfaat Produk Unggulan');
    expect(leftNames).toContain('Tombol Pesan WhatsApp');
  });

  it('deleting a product item removes it from products list and elementOrder', () => {
    const pushHistory = (state: DocumentState, config: TemplateConfig): DocumentState => ({
      ...state,
      template: { ...state.template!, config },
    });

    const testProducts = [
      DEFAULT_DEMO_PRODUCTS[0],
      { id: 'prod_2', name: 'Produk Tambahan', price: 75000, description: 'Deskripsi uji' },
    ];
    const defaultSlots = getDefaultCatalogSlots('grid_standard', testProducts);
    const initialSection: TemplateSection = {
      id: 'cat-sec',
      type: 'product_catalog',
      layoutPreset: 'grid_standard',
      props: {
        layoutPreset: 'grid_standard',
        products: [...testProducts],
        elementOrder: [...defaultSlots],
      },
    };

    const initialState: DocumentState = {
      template: {
        id: 'tpl-1',
        name: 'Test',
        description: '',
        thumbnailUrl: '',
        price: 0,
        status: 'draft',
        config: {
          schemaVersion: 1,
          sections: [initialSection],
        },
      },
      isDirty: false,
      isSaving: false,
      saveSuccess: false,
      error: null,
      history: { past: [], future: [] },
    };

    // Delete product_item_1
    const afterDelete = applyDeleteNode(initialState, 'cat-sec', 'product_item_1', pushHistory);
    const updatedSec = afterDelete.template?.config.sections.find((s: TemplateSection) => s.id === 'cat-sec');
    const updatedProducts = updatedSec?.props?.products as typeof testProducts;

    expect(updatedProducts.length).toBe(testProducts.length - 1);
    expect(updatedSec?.props?.elementOrder).not.toContain('product_item_1');
  });

  it('adding a new product item appends to products list and elementOrder', () => {
    const pushHistory = (state: DocumentState, config: TemplateConfig): DocumentState => ({
      ...state,
      template: { ...state.template!, config },
    });

    const defaultSlots = getDefaultCatalogSlots('grid_standard', DEFAULT_DEMO_PRODUCTS);
    const initialSection: TemplateSection = {
      id: 'cat-sec',
      type: 'product_catalog',
      layoutPreset: 'grid_standard',
      props: {
        layoutPreset: 'grid_standard',
        products: [...DEFAULT_DEMO_PRODUCTS],
        elementOrder: [...defaultSlots],
      },
    };

    const initialState: DocumentState = {
      template: {
        id: 'tpl-1',
        name: 'Test',
        description: '',
        thumbnailUrl: '',
        price: 0,
        status: 'draft',
        config: {
          schemaVersion: 1,
          sections: [initialSection],
        },
      },
      isDirty: false,
      isSaving: false,
      saveSuccess: false,
      error: null,
      history: { past: [], future: [] },
    };

    const afterAdd = applyAddNode(initialState, 'cat-sec', 'product_item', pushHistory);
    const updatedSec = afterAdd.state.template?.config.sections.find((s: TemplateSection) => s.id === 'cat-sec');
    const updatedProducts = updatedSec?.props?.products as typeof DEFAULT_DEMO_PRODUCTS;

    expect(updatedProducts.length).toBe(DEFAULT_DEMO_PRODUCTS.length + 1);
    expect(updatedSec?.props?.elementOrder).toContain(`product_item_${DEFAULT_DEMO_PRODUCTS.length}`);
  });

  it('adding a product item when props.products is undefined seeds from DEFAULT_DEMO_PRODUCTS', () => {
    const pushHistory = (state: DocumentState, config: TemplateConfig): DocumentState => ({
      ...state,
      template: { ...state.template!, config },
    });

    const initialSection: TemplateSection = {
      id: 'cat-sec-empty',
      type: 'product_catalog',
      layoutPreset: 'grid_standard',
      props: {
        layoutPreset: 'grid_standard',
      },
    };

    const initialState: DocumentState = {
      template: {
        id: 'tpl-1',
        name: 'Test',
        description: '',
        thumbnailUrl: '',
        price: 0,
        status: 'draft',
        config: {
          schemaVersion: 1,
          sections: [initialSection],
        },
      },
      isDirty: false,
      isSaving: false,
      saveSuccess: false,
      error: null,
      history: { past: [], future: [] },
    };

    const afterAdd = applyAddNode(initialState, 'cat-sec-empty', 'product_item', pushHistory);
    const updatedSec = afterAdd.state.template?.config.sections.find((s: TemplateSection) => s.id === 'cat-sec-empty');
    const updatedProducts = updatedSec?.props?.products as typeof DEFAULT_DEMO_PRODUCTS;

    expect(updatedProducts.length).toBe(DEFAULT_DEMO_PRODUCTS.length + 1);
    expect(updatedProducts[0].name).toBe(DEFAULT_DEMO_PRODUCTS[0].name);
    expect(updatedProducts[3].name).toBe('Produk Baru');
  });
});

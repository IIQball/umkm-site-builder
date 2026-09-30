import { describe, it, expect } from 'vitest';
import type { TemplateSection, TemplateConfig } from '@/schemas';
import { getSectionNodes } from '@/components/builder/layer/layerPanel.helpers';
import {
  getDefaultHeroSlots,
  getHeroSlotLabel,
} from '@/components/builder/sections/hero/heroLayout.helpers';
import {
  getHeaderSupportedSlots,
  getHeaderRowSlotLabel,
} from '@/components/builder/sections/header/headerLayout.helpers';
import { applyDeleteNode, applyAddNode } from '@/components/builder/stores/editorStore.mutations';
import type { DocumentState } from '@/components/builder/stores/editorStore.types';

describe('Sidebar Sync (Left LAPISAN vs Right Tata Letak Inspector)', () => {
  describe('Hero Section SSOT Sync', () => {
    it('bento_masonry_hero matches 7 elements 1:1 in left and right sidebar', () => {
      const heroSection: TemplateSection = {
        id: 'hero-1',
        type: 'hero',
        layoutPreset: 'bento_masonry_hero',
        props: {
          layoutPreset: 'bento_masonry_hero',
          elementOrder: ['badge', 'title', 'subtitle', 'cta', 'image', 'bento_promo', 'bento_review'],
        },
      };

      const leftNodes = getSectionNodes(heroSection);
      expect(leftNodes).toHaveLength(7);

      const rightSlots = getDefaultHeroSlots('bento_masonry_hero');
      expect(rightSlots).toHaveLength(7);

      const rightLabels = rightSlots.map((s) => getHeroSlotLabel(s, 'bento_masonry_hero'));
      const leftNames = leftNodes.map((n) => n.name);

      expect(rightLabels).toEqual([
        'Lencana Promo & Kategori',
        'Judul Utama (H1)',
        'Subjudul & Deskripsi',
        'Tombol Aksi (CTA)',
        'Gambar Utama (Showcase)',
        'Ubin Teks Promo',
        'Ubin Rating & Ulasan',
      ]);
      expect(leftNames).toEqual(rightLabels);
    });

    it('brand_story_founder names image slot "Foto Profil Pendiri" in both sidebars', () => {
      const founderSection: TemplateSection = {
        id: 'hero-founder',
        type: 'hero',
        layoutPreset: 'brand_story_founder',
        props: {
          layoutPreset: 'brand_story_founder',
          elementOrder: ['image', 'badge', 'title', 'subtitle', 'cta'],
        },
      };

      const leftNodes = getSectionNodes(founderSection);
      expect(leftNodes[0].name).toBe('Foto Profil Pendiri');
      expect(leftNodes[0].id).toBe('hero_founder_photo');

      const rightLabel = getHeroSlotLabel('image', 'brand_story_founder');
      expect(rightLabel).toBe('Foto Profil Pendiri');
    });

    it('all hero presets have matching slot counts and labels in left and right sidebars', () => {
      const presets = [
        'split_left_text',
        'split_right_text',
        'centered_minimal',
        'full_banner_overlay',
        'video_background_loop',
        'gradient_mesh_glow',
        'interactive_terminal_code',
        'floating_cards_showcase',
        'oversized_bold_typography',
        'social_proof_community',
        'dual_product_showcase',
        'badge_ticker_split',
        'bento_masonry_hero',
        'split_stat_counter',
        'sticky_whatsapp_pill_float',
        'sticker_badge_playful',
        'dual_contrast_split',
        'brand_story_founder',
      ];

      for (const preset of presets) {
        const slots = getDefaultHeroSlots(preset);
        const section: TemplateSection = {
          id: `hero-${preset}`,
          type: 'hero',
          layoutPreset: preset,
          props: { layoutPreset: preset, elementOrder: [...slots] },
        };

        const leftNodes = getSectionNodes(section);
        expect(leftNodes.length).toBe(slots.length);

        const leftNames = leftNodes.map((n) => n.name);
        const rightNames = slots.map((s) => getHeroSlotLabel(s, preset));
        expect(leftNames).toEqual(rightNames);
      }
    });

    it('deleting bento_promo removes it cleanly from elementOrder and updates left/right sidebars', () => {
      const pushHistory = (state: DocumentState, config: TemplateConfig): DocumentState => ({
        ...state,
        template: { ...state.template!, config },
      });
      const initialSection: TemplateSection = {
        id: 'sec-hero',
        type: 'hero',
        layoutPreset: 'bento_masonry_hero',
        props: {
          layoutPreset: 'bento_masonry_hero',
          elementOrder: ['badge', 'title', 'subtitle', 'cta', 'image', 'bento_promo', 'bento_review'],
        },
      };

      const state: DocumentState = {
        template: {
          id: 'tpl-1',
          name: 'Test',
          description: '',
          price: 0,
          thumbnailUrl: '',
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
        history: {
          past: [],
          future: [],
        },
      };

      const deletedState = applyDeleteNode(state, 'sec-hero', 'hero_bento_promo', pushHistory);
      const updatedSection = deletedState.template!.config.sections[0];
      const updatedOrder = updatedSection.props?.elementOrder as string[];

      expect(updatedOrder).not.toContain('bento_promo');
      expect(updatedOrder).toHaveLength(6);

      const remainingLeftNodes = getSectionNodes(updatedSection);
      expect(remainingLeftNodes).toHaveLength(6);
      expect(remainingLeftNodes.map((n) => n.name)).not.toContain('Ubin Teks Promo');

      // Now add it back via applyAddNode
      const addResult = applyAddNode(deletedState, 'sec-hero', 'bento_promo', pushHistory);
      const restoredSection = addResult.state.template!.config.sections[0];
      const restoredOrder = restoredSection.props?.elementOrder as string[];

      expect(restoredOrder).toContain('bento_promo');
      expect(restoredOrder).toHaveLength(7);
      expect(restoredSection.props?.bentoPromoTitle).toBe('Diskon Pembeli Pertama');
    });
  });

  describe('Header Section SSOT Sync', () => {
    it('header presets have matching elements and identical Bahasa Indonesia labels in both sidebars', () => {
      const presets = [
        'default_split',
        'centered_stacked',
        'compact_inline',
        'floating_pill_island',
        'split_nav_centered_logo',
        'command_search_bar',
        'transparent_glass_header',
        'mega_menu_dropdown',
        'top_contact_bar',
        'delivery_order_cta',
        'store_badge_highlight',
        'promo_countdown_banner',
      ];

      for (const preset of presets) {
        const section: TemplateSection = {
          id: `hdr-${preset}`,
          type: 'header_announcement',
          layoutPreset: preset,
          props: { layoutPreset: preset },
        };

        const leftNodes = getSectionNodes(section);
        const supported = getHeaderSupportedSlots(preset);

        expect(leftNodes.length).toBe(supported.length);

        const leftNames = leftNodes.map((n) => n.name);
        const supportedNames = supported.map((s) => s.name);
        expect(leftNames).toEqual(supportedNames);
      }
    });

    it('top contact bar labels match 1:1', () => {
      const section: TemplateSection = {
        id: 'hdr-contact',
        type: 'header_announcement',
        layoutPreset: 'top_contact_bar',
        props: { layoutPreset: 'top_contact_bar' },
      };

      const leftNodes = getSectionNodes(section);
      expect(leftNodes[0].name).toBe('Bar Kontak & Jam Buka');
      expect(getHeaderRowSlotLabel('announcement_bar', 'top_contact_bar')).toBe('Bar Kontak & Jam Buka');
    });

    it('countdown promo banner labels match 1:1', () => {
      const section: TemplateSection = {
        id: 'hdr-countdown',
        type: 'header_announcement',
        layoutPreset: 'promo_countdown_banner',
        props: { layoutPreset: 'promo_countdown_banner' },
      };

      const leftNodes = getSectionNodes(section);
      expect(leftNodes[0].name).toBe('Bar Hitung Mundur Promo');
      expect(getHeaderRowSlotLabel('announcement_bar', 'promo_countdown_banner')).toBe('Bar Hitung Mundur Promo');
    });
  });
});

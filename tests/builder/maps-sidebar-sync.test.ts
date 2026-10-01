import { describe, it, expect } from 'vitest';
import type { TemplateSection } from '@/schemas';
import { getSectionNodes } from '@/components/builder/layer/layerPanel.helpers';
import {
  getDefaultMapsSlots,
  getMapsSlotLabel,
  getEffectiveMapsElementOrder,
  MAPS_PRESET_SLOTS,
} from '@/components/builder/sections/maps/mapsLayout.helpers';
import { resolveMapsNodeStyle } from '@/components/builder/sections/maps/mapsStyles.helpers';
import { DEFAULT_BRANCHES } from '@/components/builder/sections/maps/maps.helpers';

describe('Google Maps Left Sidebar (Lapisan) & Right Sidebar (Tata Letak) 1:1 Synchronization', () => {
  it('defines slot definitions for all 10 presets in MAPS_PRESET_SLOTS', () => {
    expect(Object.keys(MAPS_PRESET_SLOTS)).toHaveLength(10);
    expect(MAPS_PRESET_SLOTS.fullwidth_map).toBeDefined();
    expect(MAPS_PRESET_SLOTS.compact_boxed).toBeDefined();
    expect(MAPS_PRESET_SLOTS.minimal_framed_map).toBeDefined();
  });

  const allPresets = [
    'fullwidth_map',
    'split_map_info',
    'compact_boxed',
    'floating_address_card',
    'two_column_directions',
    'store_hours_highlight',
    'interactive_route_finder',
    'minimal_framed_map',
    'multi_branch_tabs',
    'card_overlay_bottom',
  ];

  it('matches left Lapisan and right Tata Letak 1:1 across all 10 presets in single branch mode', () => {
    for (const preset of allPresets) {
      const section: TemplateSection = {
        id: `maps-${preset}`,
        type: 'google_maps',
        layoutPreset: preset,
        props: {
          badge: 'Lokasi Gerai Fisik',
          title: 'Kunjungi Outlet Kami',
          subtitle: 'Lokasi strategis di pusat kota',
          branchMode: 'single',
        },
      };

      const leftNodes = getSectionNodes(section);
      const rightSlots = getDefaultMapsSlots(preset, 'single');

      expect(leftNodes.length).toBe(rightSlots.length);

      const leftIds = leftNodes.map((n) => n.id);
      expect(leftIds).toEqual(rightSlots);

      const leftNames = leftNodes.map((n) => n.name);
      const rightLabels = rightSlots.map((s) => getMapsSlotLabel(s, preset));
      expect(leftNames).toEqual(rightLabels);
    }
  });

  it('matches left Lapisan and right Tata Letak 1:1 across all 10 presets in multi branch mode', () => {
    for (const preset of allPresets) {
      const section: TemplateSection = {
        id: `maps-${preset}-multi`,
        type: 'google_maps',
        layoutPreset: preset,
        props: {
          badge: 'Lokasi Gerai Fisik',
          title: 'Kunjungi Outlet Kami',
          branchMode: 'multi',
          branches: DEFAULT_BRANCHES,
        },
      };

      const leftNodes = getSectionNodes(section);
      const rightSlots = getDefaultMapsSlots(preset, 'multi');

      expect(leftNodes.length).toBe(rightSlots.length);

      const leftIds = leftNodes.map((n) => n.id);
      expect(leftIds).toEqual(rightSlots);
      expect(leftIds).toContain('maps_branch_selector');
    }
  });

  it('guarantees NO phantom header elements exist in compact_boxed and minimal_framed_map', () => {
    const compactSlots = getDefaultMapsSlots('compact_boxed', 'single');
    expect(compactSlots).not.toContain('badge');
    expect(compactSlots).not.toContain('title');
    expect(compactSlots).not.toContain('subtitle');
    expect(compactSlots).toEqual(['maps_info_card', 'maps_iframe', 'maps_cta_button']);

    const minimalSlots = getDefaultMapsSlots('minimal_framed_map', 'single');
    expect(minimalSlots).not.toContain('badge');
    expect(minimalSlots).not.toContain('title');
    expect(minimalSlots).not.toContain('subtitle');
    expect(minimalSlots).toEqual(['maps_info_card', 'maps_iframe']);
  });

  it('correctly provides human-readable slot labels in Indonesian', () => {
    expect(getMapsSlotLabel('badge')).toBe('Lencana & Tagline');
    expect(getMapsSlotLabel('title')).toBe('Judul Utama (H2)');
    expect(getMapsSlotLabel('subtitle')).toBe('Deskripsi Subjudul');
    expect(getMapsSlotLabel('maps_branch_selector')).toBe('Bilah Tab Cabang Gerai (Maks 5)');
    expect(getMapsSlotLabel('maps_iframe')).toBe('Bingkai Peta Interaktif (Google Maps)');
    expect(getMapsSlotLabel('maps_info_card')).toBe('Kartu Informasi Gerai & Alamat');
    expect(getMapsSlotLabel('maps_cta_button')).toBe('Tombol Petunjuk Arah (Navigasi)');
    expect(getMapsSlotLabel('maps_hours_card')).toBe('Bilah Status Jam Buka Toko');
    expect(getMapsSlotLabel('maps_directions_card')).toBe('Kartu Panduan Rute & Parkir');
  });

  it('preserves reordering and normalizes legacy slot names', () => {
    const rawOrder = ['maps_cta_button', 'maps_info_card', 'maps_iframe'];
    const effective = getEffectiveMapsElementOrder('compact_boxed', rawOrder, 'single');
    expect(effective).toEqual(['maps_cta_button', 'maps_info_card', 'maps_iframe']);

    // Legacy map_view normalization
    const legacyOrder = ['map_view', 'maps_info_card', 'maps_cta_button'];
    const normalized = getEffectiveMapsElementOrder('compact_boxed', legacyOrder, 'single');
    expect(normalized).toEqual(['maps_iframe', 'maps_info_card', 'maps_cta_button']);
  });

  it('correctly resolves node styling and aliases', () => {
    const nodeStyles = {
      title: { color: '#ef4444', fontSize: '32px' },
      maps_iframe: { borderRadius: '1rem' },
    };

    const titleStyle = resolveMapsNodeStyle('title', nodeStyles);
    expect(titleStyle.color).toBe('#ef4444');
    expect(titleStyle.fontSize).toBe('32px');

    const iframeStyle = resolveMapsNodeStyle('maps_iframe', nodeStyles);
    expect(iframeStyle.borderRadius).toBe('1rem');

    // Alias resolution for legacy maps_header
    const headerAliasStyle = resolveMapsNodeStyle('maps_header', nodeStyles);
    expect(headerAliasStyle.color).toBe('#ef4444');
  });
});

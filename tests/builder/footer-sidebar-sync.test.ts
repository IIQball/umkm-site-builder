import { describe, it, expect } from 'vitest';
import type { TemplateSection } from '@/schemas';
import { getSectionNodes } from '@/components/builder/layer/layerPanel.helpers';
import {
  FOOTER_PRESET_SLOTS,
  getDefaultFooterSlots,
  getFooterSlotLabel,
  getEffectiveFooterElementOrder,
  getAllowedFooterSlots,
} from '@/components/builder/sections/footer/footerLayout.helpers';
import { formatAttributionText } from '@/components/builder/sections/footer/footer.helpers';
import { resolveFooterNodeStyle } from '@/components/builder/sections/footer/footerStyles.helpers';

describe('Footer Section Left Sidebar & Right Sidebar 1:1 Synchronization', () => {
  const allPresets = [
    'multi_column',
    'centered_simple',
    'cta_focused',
    'minimal_single_row',
    'giant_wordmark',
    'newsletter_centric',
    'live_status_badge',
    'split_map_footer',
    'social_links_grid',
    'boxed_card_footer',
  ];

  it('defines slot definitions for all 10 presets in FOOTER_PRESET_SLOTS', () => {
    expect(Object.keys(FOOTER_PRESET_SLOTS)).toHaveLength(10);
    allPresets.forEach((preset) => {
      expect(FOOTER_PRESET_SLOTS[preset]).toBeDefined();
      expect(FOOTER_PRESET_SLOTS[preset].length).toBeGreaterThan(0);
    });
  });

  it('matches left Lapisan and right Tata Letak 1:1 across all 10 presets', () => {
    for (const preset of allPresets) {
      const section: TemplateSection = {
        id: `footer-${preset}`,
        type: 'footer',
        layoutPreset: preset,
        props: {
          brandName: 'Toko Test',
          tagline: 'Tagline Test',
        },
      };

      const leftNodes = getSectionNodes(section);
      const rightSlots = getDefaultFooterSlots(preset);

      expect(leftNodes.length).toBe(rightSlots.length);

      const leftIds = leftNodes.map((n) => n.id);
      expect(leftIds).toEqual(rightSlots);

      const leftNames = leftNodes.map((n) => n.name);
      const rightLabels = rightSlots.map((s) => getFooterSlotLabel(s, preset));
      expect(leftNames).toEqual(rightLabels);
    }
  });

  it('respects custom elementOrder while filtering out slots not allowed in the preset', () => {
    const customOrder = ['footer_contact', 'footer_brand', 'footer_copyright', 'invalid_slot'];
    const effective = getEffectiveFooterElementOrder('centered_simple', customOrder);
    expect(effective).toEqual(['footer_contact', 'footer_brand', 'footer_copyright']);

    const allowed = getAllowedFooterSlots('centered_simple');
    expect(allowed).toContain('footer_brand');
    expect(allowed).toContain('footer_copyright');
    expect(allowed).not.toContain('footer_floating_cta');
  });

  it('resolves footer node styles with fallback and alias normalization', () => {
    const sampleStyles = {
      brand_bio: { color: 'var(--color-primary)', marginTop: '16px' },
      footer_contact: { color: 'var(--color-secondary)' },
    };

    const brandStyle = resolveFooterNodeStyle('footer_brand', sampleStyles);
    expect(brandStyle.color).toBe('var(--color-primary)');
    expect(brandStyle.marginTop).toBe('16px');

    const contactStyle = resolveFooterNodeStyle('contact_info', sampleStyles);
    expect(contactStyle.color).toBe('var(--color-secondary)');
  });

  it('properly formats attribution text in storefront and builder mode', () => {
    // 1. Storefront with admin
    const withAdmin = formatAttributionText({
      isLiveStorefront: true,
      store: {
        managedByAdmin: { name: 'Admin Rudi' },
      },
    });
    expect(withAdmin).toBe('Powered by Pinoka | Didampingi oleh Admin Rudi');

    // 2. Storefront registered independently (no admin)
    const independent = formatAttributionText({
      isLiveStorefront: true,
      store: {
        managedByAdmin: null,
        registrar: null,
      },
    });
    expect(independent).toBe('Powered by Pinoka');

    // 3. Builder preview with custom designer admin name
    const builderCustom = formatAttributionText({
      isLiveStorefront: false,
      designerAdminName: 'Fasilitator UMKM Banyuwangi',
    });
    expect(builderCustom).toBe('Powered by Pinoka | Didampingi oleh Fasilitator UMKM Banyuwangi');

    // 4. Builder preview fallback
    const builderDefault = formatAttributionText({
      isLiveStorefront: false,
    });
    expect(builderDefault).toBe('Powered by Pinoka | Didampingi oleh Admin Pendamping');
  });

  it('allows slot deletion without re-adding deleted slots', () => {
    const withDeletedContact = ['footer_brand', 'footer_navigation', 'footer_copyright'];
    const effective = getEffectiveFooterElementOrder('multi_column', withDeletedContact);
    expect(effective).toEqual(['footer_brand', 'footer_navigation', 'footer_copyright']);
    expect(effective).not.toContain('footer_contact');
  });

  it('normalizes legacy slot names in custom elementOrder', () => {
    const legacyOrder = ['brand_bio', 'copyright'];
    const effective = getEffectiveFooterElementOrder('centered_simple', legacyOrder);
    expect(effective).toEqual(['footer_brand', 'footer_copyright']);
    expect(effective).not.toContain('footer_contact');
  });
});

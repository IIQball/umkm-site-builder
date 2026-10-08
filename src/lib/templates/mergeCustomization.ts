import type { TemplateConfig } from '@/schemas';
import { DEFAULT_TEMPLATE_THEME } from '@/schemas';
import { clone } from './migration';

export interface StoreProfileData {
  id?: string;
  name?: string;
  subdomain?: string;
  address?: string | null;
  waNumber?: string | null;
  googleMapsEmbedUrl?: string | null;
  googleMapsUrl?: string | null;
  categoryName?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  branchMode?: 'single' | 'multi';
  branches?: unknown[];
}

/**
 * Merges a base template configuration with store-specific customization and store profile data.
 * Produces a complete, cohesive TemplateConfig ready for storefront rendering.
 */
export function mergeStoreCustomization(
  baseConfig: TemplateConfig,
  rawCustomization: unknown,
  storeData?: StoreProfileData
): TemplateConfig {
  const config = clone(baseConfig);
  if (!config.theme) {
    config.theme = clone(DEFAULT_TEMPLATE_THEME);
  }
  if (!config.sections) {
    config.sections = [];
  }

  const cust = (rawCustomization && typeof rawCustomization === 'object' && !Array.isArray(rawCustomization))
    ? (rawCustomization as Record<string, unknown>)
    : {};

  // 1. Deep Merge Theme Tokens
  if (cust.theme && typeof cust.theme === 'object' && !Array.isArray(cust.theme)) {
    const custTheme = cust.theme as Record<string, unknown>;

    if (custTheme.colors && typeof custTheme.colors === 'object') {
      config.theme.colors = {
        ...(config.theme.colors || {}),
        ...(custTheme.colors as Record<string, string>),
      };
    }

    if (custTheme.typography && typeof custTheme.typography === 'object') {
      config.theme.typography = {
        ...(config.theme.typography || {}),
        ...(custTheme.typography as Record<string, unknown>),
      };
    }

    if (custTheme.buttons && typeof custTheme.buttons === 'object') {
      config.theme.buttons = {
        ...(config.theme.buttons || {}),
        ...(custTheme.buttons as Record<string, unknown>),
      };
    }

    if (custTheme.layout && typeof custTheme.layout === 'object') {
      config.theme.layout = {
        ...(config.theme.layout || {}),
        ...(custTheme.layout as Record<string, unknown>),
      };
    }

    if (typeof custTheme.primaryColor === 'string' && custTheme.primaryColor.trim()) {
      config.theme.primaryColor = custTheme.primaryColor;
      if (config.theme.colors) {
        config.theme.colors.primary = custTheme.primaryColor;
      }
    }

    if (typeof custTheme.fontFamily === 'string' && custTheme.fontFamily.trim()) {
      config.theme.fontFamily = custTheme.fontFamily;
      if (config.theme.typography) {
        config.theme.typography.bodyFont = custTheme.fontFamily;
      }
    }
  }

  // 2. Merge Section Overrides
  if (Array.isArray(cust.sections) && cust.sections.length > 0) {
    const customById = new Map<string, Record<string, unknown>>();
    const customByType = new Map<string, Record<string, unknown>>();

    for (const sec of cust.sections) {
      if (sec && typeof sec === 'object') {
        const item = sec as Record<string, unknown>;
        if (typeof item.id === 'string' && item.id.trim()) {
          customById.set(item.id.trim(), item);
        }
        if (typeof item.type === 'string' && item.type.trim()) {
          customByType.set(item.type.trim(), item);
        }
      }
    }

    config.sections = config.sections.map((baseSec) => {
      const override = customById.get(baseSec.id) || customByType.get(baseSec.type);
      if (!override) return baseSec;

      return {
        ...baseSec,
        layoutPreset: (override.layoutPreset as string) || baseSec.layoutPreset,
        props: {
          ...(baseSec.props || {}),
          ...((override.props as Record<string, unknown>) || {}),
        },
        styles: {
          ...(baseSec.styles || {}),
          ...((override.styles as Record<string, unknown>) || {}),
        },
      };
    });
  }

  // 3. Fallback / Inject Store Data into Sections
  if (storeData) {
    const storeName = storeData.name || '';
    const waNumber = storeData.waNumber || '';
    const address = storeData.address || '';
    const mapsUrl = storeData.googleMapsEmbedUrl || storeData.googleMapsUrl || '';
    const categoryName = storeData.categoryName || '';

    for (const section of config.sections) {
      if (!section.props) section.props = {};

      switch (section.type) {
        case 'header_announcement': {
          const customHeader = Array.isArray(cust.sections)
            ? cust.sections.find((s) => s && typeof s === 'object' && ((s as Record<string, unknown>).id === section.id || (s as Record<string, unknown>).type === 'header_announcement')) as Record<string, unknown> | undefined
            : undefined;
          const hasCustomLogoText = Boolean((customHeader?.props as Record<string, unknown> | undefined)?.logoText);

          if (storeName && !hasCustomLogoText) {
            section.props.logoText = storeName;
          }
          if (waNumber) {
            section.props.whatsappNumber = waNumber;
          }
          if (address) {
            section.props.address = address;
          }
          break;
        }

        case 'hero': {
          if ((!section.props.title || section.props.title === 'Selamat datang di toko kami') && storeName) {
            section.props.title = storeName;
          }
          if (!section.props.subtitle && categoryName) {
            section.props.subtitle = `Penyedia ${categoryName} berkualitas dengan pelayanan terbaik dan terpercaya.`;
          }
          if (waNumber) {
            section.props.whatsappNumber = waNumber;
          }
          break;
        }

        case 'product_catalog': {
          if (waNumber) {
            section.props.whatsappNumber = waNumber;
          }
          if (storeData.id) {
            section.props.storeId = storeData.id;
          }
          break;
        }

        case 'faq': {
          if (waNumber) {
            section.props.whatsappNumber = waNumber;
          }
          if (storeName) {
            section.props.storeName = storeName;
          }
          break;
        }

        case 'google_maps': {
          if (address) {
            section.props.address = address;
          }
          if (mapsUrl) {
            section.props.googleMapsUrl = mapsUrl;
          }
          if (storeData?.googleMapsEmbedUrl) {
            section.props.googleMapsEmbedUrl = storeData.googleMapsEmbedUrl;
          }
          if (waNumber) {
            section.props.whatsappNumber = waNumber;
          }
          if (storeData?.latitude != null) {
            section.props.latitude = storeData.latitude;
          }
          if (storeData?.longitude != null) {
            section.props.longitude = storeData.longitude;
          }
          if (storeName) {
            section.props.storeName = storeName;
          }
          // Support multi-branch configured in customization or storeData
          const branches = (Array.isArray(cust.branches) && cust.branches.length > 0)
            ? (cust.branches as unknown[])
            : (Array.isArray(storeData?.branches) && storeData.branches.length > 0)
              ? storeData.branches
              : [];
          if (branches.length > 0) {
            section.props.branches = branches;
            section.props.branchMode = (cust.branchMode as string) || storeData?.branchMode || 'multi';
            section.layoutPreset = 'multi_branch_tabs';
          }
          break;
        }

        case 'footer': {
          const customFooter = Array.isArray(cust.sections)
            ? cust.sections.find((s) => s && typeof s === 'object' && ((s as Record<string, unknown>).id === section.id || (s as Record<string, unknown>).type === 'footer')) as Record<string, unknown> | undefined
            : undefined;
          const hasCustomBrandName = Boolean((customFooter?.props as Record<string, unknown> | undefined)?.brandName);

          if (storeName && !hasCustomBrandName) {
            section.props.brandName = storeName;
          }
          if (address) {
            section.props.address = address;
          }
          if (waNumber) {
            section.props.whatsappNumber = waNumber;
          }
          if (mapsUrl) {
            section.props.googleMapsUrl = mapsUrl;
          }
          const headerSec = config.sections.find((s) => s.type === 'header_announcement');
          const headerLogo = headerSec?.props?.logoImageUrl as string | undefined;
          if (headerLogo && !section.props.logoImageUrl) {
            section.props.logoImageUrl = headerLogo;
          }
          break;
        }
      }
    }
  }

  return config;
}

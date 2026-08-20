import type { TemplateSection } from '@/schemas/template.schema';

export interface CatalogConfig {
  colDesktop: number;
  colTablet: number;
  colMobile: number;
  gridGapVal: string;
  cardPreset: string;
  cardRadiusVal: string;
  imageAspect: string;
  badgePos: string;
  badgeColor: string;
  nameSize: string;
  nameWeight: string;
  pricePlacement: string;
  ctaWidth: string;
  ctaColor: string;
  ctaRadius: string;
  showWA: boolean;
}

export function getCatalogConfig(section: TemplateSection): CatalogConfig {
  return {
    colDesktop: Number(section?.props?.columnsDesktop ?? section?.styles?.columnsDesktop ?? 3),
    colTablet: Number(section?.props?.columnsTablet ?? section?.styles?.columnsTablet ?? 2),
    colMobile: Number(section?.props?.columnsMobile ?? section?.styles?.columnsMobile ?? 1),
    gridGapVal: String(section?.props?.gridGap ?? section?.styles?.gridGap ?? 'normal'),
    cardPreset: String(section?.props?.cardPreset ?? section?.styles?.cardPreset ?? 'elevated_shadow'),
    cardRadiusVal: String(section?.props?.cardRadius ?? section?.styles?.cardRadius ?? 'smooth'),
    imageAspect: String(section?.props?.imageAspectRatio ?? section?.styles?.imageAspectRatio ?? 'square'),
    badgePos: String(section?.props?.badgePosition ?? section?.styles?.badgePosition ?? 'top_left'),
    badgeColor: String(section?.props?.badgeColor ?? section?.styles?.badgeColor ?? 'rose'),
    nameSize: String(section?.props?.productNameSize ?? section?.styles?.productNameSize ?? 'base'),
    nameWeight: String(section?.props?.productNameWeight ?? section?.styles?.productNameWeight ?? 'bold'),
    pricePlacement: String(section?.props?.pricePlacement ?? section?.styles?.pricePlacement ?? 'stacked'),
    ctaWidth: String(section?.props?.ctaButtonWidth ?? section?.styles?.ctaButtonWidth ?? 'full'),
    ctaColor: String(section?.props?.ctaButtonColor ?? section?.styles?.ctaButtonColor ?? '#059669'),
    ctaRadius: String(section?.props?.ctaButtonRadius ?? section?.styles?.ctaButtonRadius ?? 'smooth'),
    showWA: (section?.props?.showWhatsAppIcon ?? section?.styles?.showWhatsAppIcon) !== false,
  };
}

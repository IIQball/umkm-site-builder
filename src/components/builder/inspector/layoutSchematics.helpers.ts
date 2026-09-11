import { getHeaderSchematicSvg } from './schematics/headerSchematics';
import { getHeroSchematicSvg } from './schematics/heroSchematics';
import { getFeaturesSchematicSvg } from './schematics/featuresSchematics';
import { getCatalogSchematicSvg } from './schematics/catalogSchematics';
import { getTestimonialsSchematicSvg } from './schematics/testimonialsSchematics';
import { getFaqSchematicSvg } from './schematics/faqSchematics';
import { getMapsSchematicSvg } from './schematics/mapsSchematics';
import { getFooterSchematicSvg } from './schematics/footerSchematics';

export const getPresetSchematicSvg = (sectionType: string, presetId: string): string => {
  switch (sectionType) {
    case 'header_announcement':
      return getHeaderSchematicSvg(presetId);
    case 'hero':
      return getHeroSchematicSvg(presetId);
    case 'features':
      return getFeaturesSchematicSvg(presetId);
    case 'product_catalog':
      return getCatalogSchematicSvg(presetId);
    case 'testimonials':
      return getTestimonialsSchematicSvg(presetId);
    case 'faq':
      return getFaqSchematicSvg(presetId);
    case 'google_maps':
      return getMapsSchematicSvg(presetId);
    case 'footer':
      return getFooterSchematicSvg(presetId);
    default:
      return getHeroSchematicSvg(presetId);
  }
};

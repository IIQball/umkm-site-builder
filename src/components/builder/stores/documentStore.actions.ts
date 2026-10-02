import {
  type TemplateConfig,
  type TemplateSection,
  type TemplateTheme,
  DEFAULT_TEMPLATE_THEME,
} from '@/schemas';
import {
  type DocumentState,
  clone,
} from './editorStore.types';
import { getSectionDefaultSlots } from '../inspector/sectionSlot.helpers';
import {
  getDefaultHeaderNavbarOrder,
  getDefaultHeaderRowOrder,
} from '../sections/header/headerLayout.helpers';

export const getDefaultLayoutPreset = (type: TemplateSection['type']): string => {
  switch (type) {
    case 'header_announcement': return 'default_split';
    case 'hero': return 'split_left_text';
    case 'features': return 'grid_3_cards';
    case 'product_catalog': return 'grid_standard';
    case 'testimonials': return 'masonry_grid';
    case 'faq': return 'accordion_single_col';
    case 'google_maps': return 'fullwidth_map';
    case 'footer': return 'multi_column';
    default: return 'default';
  }
};

export function createHistoryManager() {
  let lastHistoryTime = 0;

  const pushHistory = (state: DocumentState, newConfig: TemplateConfig): DocumentState => {
    if (!state.template) return state;
    const now = Date.now();
    const shouldMerge = now - lastHistoryTime < 350 && state.history.past.length > 0;
    lastHistoryTime = now;

    const past = shouldMerge
      ? state.history.past
      : [...state.history.past, clone(state.template.config)].slice(-20);

    return {
      ...state,
      template: { ...state.template, config: newConfig },
      history: { past, future: [] },
      isDirty: true,
    };
  };

  return { pushHistory };
}

export function buildUpdatedTheme(
  currentTheme: Partial<TemplateTheme>,
  updates: Partial<TemplateTheme>
): TemplateTheme {
  const currentTypo = (currentTheme.typography || {}) as Record<string, unknown>;
  const updateTypo = (updates.typography || {}) as Record<string, unknown>;

  const mergedTypography: Record<string, unknown> = {
    ...currentTypo,
    ...updateTypo,
  };

  const typoTags = ['h1', 'h2', 'h3', 'body', 'caption'];
  for (const tag of typoTags) {
    if (currentTypo[tag] || updateTypo[tag]) {
      mergedTypography[tag] = {
        ...((currentTypo[tag] as Record<string, unknown>) || {}),
        ...((updateTypo[tag] as Record<string, unknown>) || {}),
      };
    }
  }

  return {
    ...DEFAULT_TEMPLATE_THEME,
    ...currentTheme,
    ...updates,
    colors: { ...(currentTheme.colors || {}), ...(updates.colors || {}) },
    typography: mergedTypography as TemplateTheme['typography'],
    buttons: {
      ...(currentTheme.buttons || {}),
      ...(updates.buttons || {}),
      primary: { ...(currentTheme.buttons?.primary || {}), ...(updates.buttons?.primary || {}) },
      secondary: { ...(currentTheme.buttons?.secondary || {}), ...(updates.buttons?.secondary || {}) },
      outline: { ...(currentTheme.buttons?.outline || {}), ...(updates.buttons?.outline || {}) },
    },
    layout: { ...(currentTheme.layout || {}), ...(updates.layout || {}) },
  };
}

export function applyThemeUpdates(
  state: DocumentState,
  updates: Partial<TemplateTheme>,
  pushHistory: (state: DocumentState, config: TemplateConfig) => DocumentState
): DocumentState {
  if (!state.template) return state;
  const currentTheme = state.template.config.theme || DEFAULT_TEMPLATE_THEME;
  const newTheme = buildUpdatedTheme(currentTheme, updates);
  return pushHistory(state, { ...state.template.config, theme: newTheme });
}

export const DEFAULT_SLOTS_BY_SECTION: Record<string, string[]> = {
  hero: ['badge', 'title', 'subtitle', 'cta', 'image'],
  header_announcement: ['logo', 'nav_links', 'cta', 'announcement_bar'],
  features: ['badge', 'title', 'subtitle', 'features_grid'],
  product_catalog: ['badge', 'title', 'subtitle', 'catalog_grid'],
  testimonials: ['badge', 'title', 'subtitle', 'testimonials_grid'],
  faq: ['badge', 'title', 'subtitle', 'faq_item_0', 'faq_item_1', 'faq_item_2', 'faq_item_3'],
  google_maps: ['badge', 'title', 'subtitle', 'maps_iframe', 'maps_info_card', 'maps_cta_button'],
  footer: ['footer_brand', 'footer_contact', 'footer_navigation', 'footer_copyright'],
};

export function applyReorderSectionSlot(
  state: DocumentState,
  sectionId: string,
  fromIndex: number,
  toIndex: number,
  pushHistory: (state: DocumentState, config: TemplateConfig) => DocumentState,
  groupKey: string = 'elementOrder'
): DocumentState {
  if (!state.template) return state;
  const sections = state.template.config.sections.map((s) => {
    if (s.id !== sectionId) return s;
    const currentProps = { ...(s.props || {}) };
    let defaultSlots: string[] = [];
    if (groupKey === 'rowOrder') {
      defaultSlots = ['announcement_bar', 'navbar'];
    } else if (groupKey === 'navbarOrder') {
      const preset = (currentProps.layoutPreset as string) || s.layoutPreset || '';
      defaultSlots = getDefaultHeaderNavbarOrder(preset);
    } else {
      defaultSlots = getSectionDefaultSlots(s);
    }

    const currentList = currentProps[groupKey];
    const order = Array.isArray(currentList) && currentList.length > 0
      ? [...(currentList as string[])]
      : [...defaultSlots];
    if (fromIndex < 0 || fromIndex >= order.length || toIndex < 0 || toIndex >= order.length) return s;
    const [moved] = order.splice(fromIndex, 1);
    order.splice(toIndex, 0, moved);
    currentProps[groupKey] = order;
    if (s.type === 'hero') {
      const preset = (currentProps.layoutPreset as string) || (s.styles?.layoutPreset as string) || s.layoutPreset || 'split_left_text';
      currentProps.heroPreset = preset;
    }
    return { ...s, props: currentProps };
  });
  return pushHistory(state, { ...state.template.config, sections });
}

export function applyReorderArrayItem(
  state: DocumentState,
  sectionId: string,
  arrayKey: string,
  fromIndex: number,
  toIndex: number,
  pushHistory: (state: DocumentState, config: TemplateConfig) => DocumentState
): DocumentState {
  if (!state.template) return state;
  const sections = state.template.config.sections.map((s) => {
    if (s.id !== sectionId) return s;
    const array = [...((s.props?.[arrayKey] as unknown[]) || [])];
    if (fromIndex < 0 || fromIndex >= array.length || toIndex < 0 || toIndex >= array.length) return s;
    const [movedItem] = array.splice(fromIndex, 1);
    array.splice(toIndex, 0, movedItem);
    return { ...s, props: { ...s.props, [arrayKey]: array } };
  });
  return pushHistory(state, { ...state.template.config, sections });
}

export function applyNodeStyleToken(
  state: DocumentState,
  sectionId: string,
  nodeId: string,
  tokenKey: string,
  value: string,
  pushHistory: (state: DocumentState, config: TemplateConfig) => DocumentState
): DocumentState {
  if (!state.template) return state;
  const sections = state.template.config.sections.map((s) => {
    if (s.id !== sectionId) return s;
    const currentProps = { ...(s.props || {}) };
    const nodeStyles = { ...((currentProps.nodeStyles as Record<string, Record<string, string>>) || {}) };
    nodeStyles[nodeId] = {
      ...(nodeStyles[nodeId] || {}),
      [tokenKey]: value,
    };
    currentProps.nodeStyles = nodeStyles;
    return { ...s, props: currentProps };
  });
  return pushHistory(state, { ...state.template.config, sections });
}

export function applySectionSpacing(
  state: DocumentState,
  sectionId: string,
  spacing: { paddingY?: number; paddingX?: number; gap?: number },
  pushHistory: (state: DocumentState, config: TemplateConfig) => DocumentState
): DocumentState {
  if (!state.template) return state;
  const sections = state.template.config.sections.map((s) => {
    if (s.id !== sectionId) return s;
    const styles = { ...(s.styles || {}) };
    if (spacing.paddingY !== undefined || spacing.paddingX !== undefined) {
      const py = spacing.paddingY ?? 0;
      const px = spacing.paddingX ?? 0;
      styles.padding = `${py}px ${px}px`;
    }
    if (spacing.gap !== undefined) {
      styles.gap = `${spacing.gap}px`;
    }
    return { ...s, styles };
  });
  return pushHistory(state, { ...state.template.config, sections });
}

export function applyNodeSpacing(
  state: DocumentState,
  sectionId: string,
  nodeId: string,
  spacing: { marginTop?: number; marginBottom?: number; padding?: number },
  pushHistory: (state: DocumentState, config: TemplateConfig) => DocumentState
): DocumentState {
  if (!state.template) return state;
  const sections = state.template.config.sections.map((s) => {
    if (s.id !== sectionId) return s;
    const currentProps = { ...(s.props || {}) };
    const nodeStyles = { ...((currentProps.nodeStyles as Record<string, Record<string, string>>) || {}) };
    const current = { ...(nodeStyles[nodeId] || {}) };
    if (spacing.marginTop !== undefined) current.marginTop = `${spacing.marginTop}px`;
    if (spacing.marginBottom !== undefined) current.marginBottom = `${spacing.marginBottom}px`;
    if (spacing.padding !== undefined) current.padding = `${spacing.padding}px`;
    nodeStyles[nodeId] = current;
    currentProps.nodeStyles = nodeStyles;
    return { ...s, props: currentProps };
  });
  return pushHistory(state, { ...state.template.config, sections });
}

export function applyUpdateSectionLayoutPreset(
  state: DocumentState,
  sectionId: string,
  preset: string,
  pushHistory: (state: DocumentState, config: TemplateConfig) => DocumentState
): DocumentState {
  if (!state.template) return state;
  const sections = state.template.config.sections.map((s) => {
    if (s.id !== sectionId) return s;
    const nextProps: Record<string, unknown> = { ...(s.props || {}), layoutPreset: preset };
    if (s.type === 'hero') {
      nextProps.elementOrder = getSectionDefaultSlots({ ...s, layoutPreset: preset });
      nextProps.heroPreset = preset;
    } else if (s.type === 'features') {
      nextProps.elementOrder = getSectionDefaultSlots({ ...s, layoutPreset: preset });
      nextProps.featuresPreset = preset;
    } else if (s.type === 'header_announcement') {
      const defaultNav = getDefaultHeaderNavbarOrder(preset);
      const defaultRow = getDefaultHeaderRowOrder(preset);
      nextProps.navbarOrder = defaultNav;
      nextProps.rowOrder = defaultRow;
      nextProps.elementOrder = defaultNav;
    } else {
      nextProps.elementOrder = getSectionDefaultSlots({ ...s, layoutPreset: preset });
    }
    const nextStyles = { ...(s.styles || {}), layoutPreset: preset };
    return { ...s, layoutPreset: preset, props: nextProps, styles: nextStyles };
  });
  return pushHistory(state, { ...state.template.config, sections });
}

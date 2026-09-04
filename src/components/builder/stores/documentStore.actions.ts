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

export function applyReorderSectionSlot(
  state: DocumentState,
  sectionId: string,
  fromIndex: number,
  toIndex: number,
  pushHistory: (state: DocumentState, config: TemplateConfig) => DocumentState
): DocumentState {
  if (!state.template) return state;
  const sections = state.template.config.sections.map((s) => {
    if (s.id !== sectionId) return s;
    const currentProps = { ...(s.props || {}) };
    const order = Array.isArray(currentProps.elementOrder)
      ? [...currentProps.elementOrder]
      : ['badge', 'title', 'subtitle', 'image', 'cta'];
    if (fromIndex < 0 || fromIndex >= order.length || toIndex < 0 || toIndex >= order.length) return s;
    const [moved] = order.splice(fromIndex, 1);
    order.splice(toIndex, 0, moved);
    currentProps.elementOrder = order;
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

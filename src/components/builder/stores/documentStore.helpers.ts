import type { TemplateSection } from '@/schemas';
import type { EditorTemplate } from './editorStore.types';

export function ensureSectionExists(sections: TemplateSection[], sectionId: string): TemplateSection[] {
  if (sections.some((s) => s.id === sectionId)) {
    return sections;
  }
  return [
    ...sections,
    {
      id: sectionId,
      type: 'hero',
      layoutPreset: 'split_left_text',
      props: {},
      styles: {},
    },
  ];
}

export function updateSectionPropsInTemplate(template: EditorTemplate, sectionId: string, props: Record<string, unknown>): EditorTemplate {
  const baseSections = ensureSectionExists(template.config.sections, sectionId);
  const sections = baseSections.map((sec) => {
    if (sec.id !== sectionId) return sec;
    return {
      ...sec,
      props: { ...sec.props, ...props },
    };
  });
  return {
    ...template,
    config: { ...template.config, sections },
  };
}

export function updateSectionStylesInTemplate(
  template: EditorTemplate,
  sectionId: string,
  styles: Record<string, string | undefined>,
): EditorTemplate {
  const baseSections = ensureSectionExists(template.config.sections, sectionId);
  const sections = baseSections.map((sec) => {
    if (sec.id !== sectionId) return sec;
    const merged: Record<string, string | undefined> = { ...(sec.styles as Record<string, string | undefined>), ...styles };
    for (const key of Object.keys(merged)) {
      if (merged[key] === undefined || merged[key] === '') {
        delete merged[key];
      }
    }
    return {
      ...sec,
      styles: merged as TemplateSection['styles'],
    };
  });
  return {
    ...template,
    config: { ...template.config, sections },
  };
}

export function updateNodeStyleTokenInTemplate(
  template: EditorTemplate,
  sectionId: string,
  nodeName: string,
  styleProp: string,
  tokenValue: string,
): EditorTemplate {
  const baseSections = ensureSectionExists(template.config.sections, sectionId);
  const sections = baseSections.map((sec) => {
    if (sec.id !== sectionId) return sec;
    const currentNodeStyles = (sec.props?.nodeStyles as Record<string, Record<string, string>>) || {};
    const currentTargetNode = currentNodeStyles[nodeName] || {};
    const updatedTargetNode = {
      ...currentTargetNode,
      [styleProp]: tokenValue,
    };
    if (!tokenValue) {
      delete updatedTargetNode[styleProp];
    }
    return {
      ...sec,
      props: {
        ...sec.props,
        nodeStyles: {
          ...currentNodeStyles,
          [nodeName]: updatedTargetNode,
        },
      },
    };
  });
  return {
    ...template,
    config: { ...template.config, sections },
  };
}

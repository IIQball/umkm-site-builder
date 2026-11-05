import type { TemplateSection } from '@/schemas';

export const makeHandlePropChange =
  (section: TemplateSection, onUpdate: (s: TemplateSection) => void) =>
  (key: string, value: unknown) => {
    onUpdate({
      ...section,
      props: { ...(section.props || {}), [key]: value },
    });
  };

export const makeHandleArrayItemChange =
  (section: TemplateSection, onUpdate: (s: TemplateSection) => void) =>
  (arrayKey: string, index: number, itemKey: string, value: unknown) => {
    const array = [...((section.props?.[arrayKey] as Record<string, unknown>[]) || [])];
    if (typeof array[index] === 'object' && array[index] !== null) {
      array[index] = { ...array[index], [itemKey]: value };
    } else {
      (array as unknown[])[index] = value;
    }
    onUpdate({ ...section, props: { ...(section.props || {}), [arrayKey]: array } });
  };

export const makeHandleAddArrayItem =
  (section: TemplateSection, onUpdate: (s: TemplateSection) => void) =>
  (arrayKey: string, template: unknown) => {
    const array = [...((section.props?.[arrayKey] as unknown[]) || [])];
    onUpdate({ ...section, props: { ...(section.props || {}), [arrayKey]: [...array, template] } });
  };

export const makeHandleRemoveArrayItem =
  (section: TemplateSection, onUpdate: (s: TemplateSection) => void) =>
  (arrayKey: string, index: number) => {
    const array = ((section.props?.[arrayKey] as unknown[]) || []).filter(
      (_: unknown, i: number) => i !== index
    );
    onUpdate({ ...section, props: { ...(section.props || {}), [arrayKey]: array } });
  };

export const makeHandleMoveArrayItem =
  (section: TemplateSection, onUpdate: (s: TemplateSection) => void) =>
  (arrayKey: string, index: number, direction: 'up' | 'down') => {
    const array = [...((section.props?.[arrayKey] as unknown[]) || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= array.length) return;
    const temp = array[index];
    array[index] = array[targetIndex];
    array[targetIndex] = temp;
    onUpdate({ ...section, props: { ...(section.props || {}), [arrayKey]: array } });
  };

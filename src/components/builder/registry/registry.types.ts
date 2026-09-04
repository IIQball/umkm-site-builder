import type { ComponentType } from 'svelte';
import type { TemplateSection } from '@/schemas';

export interface SectionDefinition {
  type: TemplateSection['type'] | string;
  label: string;
  icon: ComponentType;
  renderComponent: ComponentType;
  inspectorComponent?: ComponentType;
  stylesComponent?: ComponentType;
  defaultConfig?: TemplateSection | Record<string, unknown>;
  layoutPresets: Record<string, string> | string[];
  isFullBleed?: boolean;
}

export type SectionRegistryMap = Record<string, SectionDefinition>;

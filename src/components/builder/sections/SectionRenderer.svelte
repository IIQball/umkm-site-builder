<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import type { SectionStyles } from '@/types';
  import { getSectionDefinition } from '../registry';

  export let section: TemplateSection;
  export let isActive: boolean = false;
  export let storeId: string | null = null;

  const isDarkColor = (color?: unknown): boolean => {
    if (typeof color !== 'string' || !color || color === 'transparent') return false;
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16) || 0;
      const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16) || 0;
      const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16) || 0;
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness < 128;
    }
    return false;
  };

  const buildStyle = (styles: SectionStyles = {}): string => {
    const s = styles || {};
    const rules: string[] = [];
    const defaultTextColor = isDarkColor(s.backgroundColor || '#ffffff') ? '#f8fafc' : '#0f172a';

    const defaultPadding = '0px';
    rules.push(`background-color: ${s.backgroundColor || 'transparent'}`);
    rules.push(`color: ${s.color || defaultTextColor}`);
    rules.push(`padding: ${s.padding || defaultPadding}`);
    rules.push(`text-align: ${s.textAlign || 'center'}`);
    rules.push(`border-radius: ${s.borderRadius || '0px'}`);
    if (s.fontFamily) rules.push(`font-family: ${s.fontFamily}`);

    if (s.marginTop) rules.push(`margin-top: ${s.marginTop}`);
    if (s.marginBottom) rules.push(`margin-bottom: ${s.marginBottom}`);
    if (s.paddingTop) rules.push(`padding-top: ${s.paddingTop}`);
    if (s.paddingBottom) rules.push(`padding-bottom: ${s.paddingBottom}`);
    if (s.paddingLeft) rules.push(`padding-left: ${s.paddingLeft}`);
    if (s.paddingRight) rules.push(`padding-right: ${s.paddingRight}`);
    if (s.fontSize) rules.push(`font-size: ${s.fontSize}`);
    if (s.fontWeight) rules.push(`font-weight: ${s.fontWeight}`);
    if (s.display) rules.push(`display: ${s.display}`);
    if (s.alignItems) rules.push(`align-items: ${s.alignItems}`);
    if (s.justifyContent) rules.push(`justify-content: ${s.justifyContent}`);
    if (s.gap) rules.push(`gap: ${s.gap}`);
    if (s.margin) rules.push(`margin: ${s.margin}`);
    if (s.maxWidth) rules.push(`max-width: ${s.maxWidth}`);

    // Entrance Animation
    if (s.animation && s.animation !== 'none') {
      const dur = s.animationDuration || '600ms';
      const del = s.animationDelay || '0ms';
      rules.push(`animation: ${s.animation} ${dur} cubic-bezier(0.16, 1, 0.3, 1) ${del} both`);
    }

    return rules.join('; ');
  };

  $: inlineStyle = buildStyle(section?.styles);
  $: containerWidthMode = section?.styles?.containerWidth || 'boxed';
  $: containerClass = containerWidthMode === 'full'
    ? 'w-full max-w-full'
    : 'mx-auto w-full max-w-full';
  $: containerStyle = containerWidthMode === 'full'
    ? ''
    : 'max-width: var(--theme-max-width, 1200px);';

  $: sectionDef = getSectionDefinition(section?.type);
  $: isFullBleed = sectionDef?.isFullBleed ?? (section?.type === 'header_announcement' || section?.type === 'hero');
  $: sectionProps = section?.type === 'product_catalog'
    ? { ...(section.props || {}), storeId: storeId || (typeof section.props?.storeId === 'string' ? section.props.storeId : undefined) }
    : (section?.props || {});
</script>

<section
  id={section.id}
  style={inlineStyle}
  class="relative box-border w-full max-w-full overflow-x-hidden min-w-0 font-[family-name:var(--theme-font-body)]"
>
  {#if sectionDef}
    {#if isFullBleed}
      <svelte:component
        this={sectionDef.renderComponent}
        props={sectionProps}
        styles={section.styles || {}}
        sectionId={section.id}
        {isActive}
        layoutPreset={section.layoutPreset}
        {storeId}
      />
    {:else}
      <div class={`${containerClass} section-safe-container min-w-0 box-border`} style="padding-left: var(--active-safe-zone, 32px); padding-right: var(--active-safe-zone, 32px); {containerStyle}">
        <svelte:component
          this={sectionDef.renderComponent}
          props={sectionProps}
          styles={section.styles || {}}
          sectionId={section.id}
          {isActive}
          layoutPreset={section.layoutPreset}
          {storeId}
        />
      </div>
    {/if}
  {/if}
</section>

<style>
  .section-safe-container {
    padding-left: var(--theme-safe-zone-desktop, 32px);
    padding-right: var(--theme-safe-zone-desktop, 32px);
  }

  @media (max-width: 1024px) {
    .section-safe-container {
      padding-left: var(--theme-safe-zone-tablet, 24px);
      padding-right: var(--theme-safe-zone-tablet, 24px);
    }
  }

  @media (max-width: 640px) {
    .section-safe-container {
      padding-left: var(--theme-safe-zone-mobile, 16px);
      padding-right: var(--theme-safe-zone-mobile, 16px);
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideLeft {
    from { opacity: 0; transform: translateX(24px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes slideRight {
    from { opacity: 0; transform: translateX(-24px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes zoomIn {
    from { opacity: 0; transform: scale(0.94); }
    to { opacity: 1; transform: scale(1); }
  }

  :global(.animate-fade-in) {
    animation: fadeIn 600ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  :global(.animate-slide-up) {
    animation: slideUp 600ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  :global(.animate-zoom-in) {
    animation: zoomIn 600ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }
</style>

<script lang="ts">
  import { Palette, Type, MousePointerClick, Layout, Sparkles } from 'lucide-svelte';
  import { editorStore } from '../stores/editorStore';
  import type { TemplateTheme } from '@/schemas';
  import ThemeColorsTab from './theme/ThemeColorsTab.svelte';
  import ThemeTypographyTab from './theme/ThemeTypographyTab.svelte';
  import ThemeButtonsTab from './theme/ThemeButtonsTab.svelte';
  import ThemeLayoutTab from './theme/ThemeLayoutTab.svelte';

  type ThemeTab = 'colors' | 'typography' | 'buttons' | 'layout';
  let activeTab: ThemeTab = 'colors';

  $: theme = ($editorStore.template?.config.theme || {}) as TemplateTheme;

  const setCanvasCssVar = (props: string | Record<string, string>, val?: string) => {
    if (typeof document === 'undefined') return;
    const targets = document.querySelectorAll<HTMLElement>('#canvas-frame, [aria-label="Editable Page Canvas"]');
    const updateEntries: [string, string][] = typeof props === 'string' && val !== undefined
      ? [[props, val]]
      : Object.entries(props as Record<string, string>);
    targets.forEach((el) => {
      for (const [p, v] of updateEntries) {
        el.style.setProperty(p, v);
      }
    });
  };

  const updateColorOptimistic = (key: string, value: string) => {
    const cssMap: Record<string, Record<string, string>> = {
      primary: { '--theme-primary': value, '--color-primary': value },
      secondary: { '--theme-secondary': value, '--color-secondary': value },
      background: { '--theme-bg': value, '--color-bg-base': value },
      surface: { '--theme-surface': value, '--color-card-base': value },
      textPrimary: { '--theme-text-primary': value, '--color-text-main': value },
      textMuted: { '--theme-text-muted': value, '--color-text-secondary': value, '--color-text-muted': value },
    };
    if (cssMap[key]) setCanvasCssVar(cssMap[key]);
    editorStore.updateGlobalTheme({
      colors: { [key]: value },
      ...(key === 'primary' ? { primaryColor: value } : {}),
    });
  };

  const updateTypography = (key: string, value: unknown) => {
    const valStr = String(value);
    if (key === 'headingFont') setCanvasCssVar({ '--theme-font-heading': valStr, '--font-heading': valStr });
    if (key === 'bodyFont') setCanvasCssVar({ '--theme-font-body': valStr, '--font-family': valStr, '--font-sans': valStr });
    editorStore.updateGlobalTheme({
      typography: { [key]: value },
      ...(key === 'bodyFont' ? { fontFamily: valStr } : {}),
    });
  };

  const updateScale = (tag: string, field: string, value: string) => {
    const current = (theme.typography as Record<string, Record<string, string> | undefined>)?.[tag] || {};
    if (field === 'fontSize') {
      setCanvasCssVar({
        [`--theme-text-${tag}`]: value,
        [`--text-${tag}-size`]: value,
      });
    }
    editorStore.updateGlobalTheme({
      typography: { [tag]: { ...current, [field]: value } },
    });
  };

  const updateButtonVariantOptimistic = (variantKey: string, key: string, value: string) => {
    if (variantKey === 'primary' && key === 'backgroundColor') setCanvasCssVar({ '--theme-btn-primary-bg': value, '--btn-primary-bg': value });
    if (variantKey === 'primary' && key === 'textColor') setCanvasCssVar({ '--theme-btn-primary-text': value, '--btn-primary-text': value });
    if (variantKey === 'secondary' && key === 'backgroundColor') setCanvasCssVar({ '--theme-btn-secondary-bg': value, '--btn-secondary-bg': value });
    if (variantKey === 'secondary' && key === 'textColor') setCanvasCssVar({ '--theme-btn-secondary-text': value, '--btn-secondary-text': value });
    if (variantKey === 'outline' && key === 'borderColor') setCanvasCssVar({ '--theme-btn-outline-border': value, '--btn-outline-border': value });
    if (variantKey === 'outline' && key === 'textColor') setCanvasCssVar({ '--theme-btn-outline-text': value, '--btn-outline-text': value });

    const variant = variantKey as 'primary' | 'secondary' | 'outline';
    const current = (theme.buttons || {})[variant] || {};
    editorStore.updateGlobalTheme({
      buttons: { [variant]: { ...current, [key]: value } },
    });
  };

  const updateButtonRadius = (value: string) => {
    setCanvasCssVar({ '--theme-btn-radius': value, '--btn-radius': value });
    editorStore.updateGlobalTheme({ buttons: { borderRadius: value } });
  };

  const updateLayoutParam = (key: string, value: string) => {
    if (key === 'maxWidth') setCanvasCssVar({ '--theme-max-width': value, '--active-max-width': value });
    if (key === 'horizontalMarginDesktop') setCanvasCssVar({ '--theme-safe-zone-desktop': value, '--active-safe-zone': value });
    if (key === 'horizontalMarginTablet') setCanvasCssVar({ '--theme-safe-zone-tablet': value, '--active-safe-zone': value });
    if (key === 'horizontalMarginMobile') setCanvasCssVar({ '--theme-safe-zone-mobile': value, '--active-safe-zone': value });
    editorStore.updateGlobalTheme({ layout: { [key]: value } });
  };
</script>

<div class="flex flex-col h-full overflow-hidden text-xs text-base-content/80">
  <div class="p-3.5 border-b border-base-200 dark:border-slate-800 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent">
    <div class="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
      <Sparkles size={14} />
      <span>Global Design System</span>
    </div>
    <p class="text-[11px] text-base-content/60 mt-1">
      Token desain global diwarisi seluruh section kanvas.
    </p>
  </div>

  <div class="grid grid-cols-4 border-b border-base-200 dark:border-slate-800 bg-base-200/50 p-1 gap-0.5 text-[11px]">
    {#each [
      { id: 'colors', label: 'Warna', icon: Palette },
      { id: 'typography', label: 'Font', icon: Type },
      { id: 'buttons', label: 'Tombol', icon: MousePointerClick },
      { id: 'layout', label: 'Layout', icon: Layout }
    ] as tab}
      <button
        type="button"
        on:click={() => { activeTab = tab.id === 'colors' || tab.id === 'typography' || tab.id === 'buttons' || tab.id === 'layout' ? tab.id : 'colors'; }}
        class={`flex flex-col items-center gap-1 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
          activeTab === tab.id ? 'bg-base-100 text-blue-600 dark:text-blue-400 font-bold shadow-sm' : 'text-base-content/60 hover:text-base-content'
        }`}
      >
        <svelte:component this={tab.icon} size={13} />
        <span>{tab.label}</span>
      </button>
    {/each}
  </div>

  <div class="flex-1 overflow-y-auto p-4 space-y-4">
    {#if activeTab === 'colors'}
      <ThemeColorsTab {theme} onColorChange={updateColorOptimistic} />
    {:else if activeTab === 'typography'}
      <ThemeTypographyTab
        {theme}
        onTypographyChange={updateTypography}
        onScaleChange={updateScale}
      />
    {:else if activeTab === 'buttons'}
      <ThemeButtonsTab
        {theme}
        onButtonVariantChange={updateButtonVariantOptimistic}
        onButtonRadiusChange={updateButtonRadius}
      />
    {:else if activeTab === 'layout'}
      <ThemeLayoutTab {theme} onLayoutChange={updateLayoutParam} />
    {/if}
  </div>
</div>

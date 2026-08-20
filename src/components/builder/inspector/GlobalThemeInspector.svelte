<script lang="ts">
  import { Palette, Type, MousePointerClick, Layout, Sparkles } from 'lucide-svelte';
  import { editorStore } from '../stores/editorStore';
  import type { TemplateTheme } from '@/schemas/template.schema';

  type ThemeTab = 'colors' | 'typography' | 'buttons' | 'layout';
  let activeTab: ThemeTab = 'colors';

  $: theme = ($editorStore.template?.config.theme || {}) as TemplateTheme;
  $: colors = theme.colors || {};
  $: typography = theme.typography || {};
  $: buttons = theme.buttons || {};
  $: layout = theme.layout || {};

  const fontOptions = [
    { label: 'Inter (Sans)', value: 'Inter, sans-serif' },
    { label: 'Plus Jakarta Sans', value: '"Plus Jakarta Sans", sans-serif' },
    { label: 'Poppins', value: 'Poppins, sans-serif' },
    { label: 'Outfit', value: 'Outfit, sans-serif' },
    { label: 'Playfair Display (Serif)', value: '"Playfair Display", serif' },
    { label: 'Merriweather (Serif)', value: 'Merriweather, serif' },
    { label: 'System Sans', value: 'system-ui, -apple-system, sans-serif' },
  ];

  const radiusPresets = [
    { label: 'Sharp', value: '0px' },
    { label: 'SM (4px)', value: '4px' },
    { label: 'MD (8px)', value: '8px' },
    { label: 'LG (16px)', value: '16px' },
    { label: 'Pill', value: '9999px' },
  ];

  const maxWidthOptions = [
    { label: '1024px (Compact)', value: '1024px' },
    { label: '1200px (Standard)', value: '1200px' },
    { label: '1280px (Spacious)', value: '1280px' },
    { label: '100% (Full Width)', value: '100%' },
  ];

  const typographyScales = [
    { tag: 'h1', label: 'H1 (Heading 1)', defaultSize: '36px', defaultWeight: '700' },
    { tag: 'h2', label: 'H2 (Heading 2)', defaultSize: '28px', defaultWeight: '700' },
    { tag: 'h3', label: 'H3 (Heading 3)', defaultSize: '22px', defaultWeight: '600' },
    { tag: 'body', label: 'Body Text', defaultSize: '15px', defaultWeight: '400' },
    { tag: 'caption', label: 'Caption / Small', defaultSize: '13px', defaultWeight: '400' },
  ];

  const colorFields: Array<{ key: string; label: string; defaultVal: string }> = [
    { key: 'primary', label: 'Primary Brand Color', defaultVal: '#3b82f6' },
    { key: 'secondary', label: 'Secondary / Accent Color', defaultVal: '#64748b' },
    { key: 'background', label: 'Background Kanvas', defaultVal: '#ffffff' },
    { key: 'surface', label: 'Surface / Card Background', defaultVal: '#f8fafc' },
    { key: 'textPrimary', label: 'Teks Utama (Primary)', defaultVal: '#0f172a' },
    { key: 'textMuted', label: 'Teks Redup (Muted)', defaultVal: '#64748b' },
  ];

  const getScaleData = (tag: string): Record<string, string> => {
    const record = typography as Record<string, Record<string, string> | undefined>;
    return record?.[tag] || {};
  };

  const getColorVal = (key: string, defaultVal: string): string => {
    const record = colors as Record<string, string | undefined>;
    return record?.[key] || defaultVal;
  };

  const getButtonVariant = (key: string) => {
    return buttons[key as 'primary' | 'secondary'] || {};
  };

  const updateColor = (key: string, value: string) => {
    editorStore.updateGlobalTheme({
      colors: { [key]: value },
      ...(key === 'primary' ? { primaryColor: value } : {}),
    });
  };

  const updateTypography = (key: string, value: unknown) => {
    editorStore.updateGlobalTheme({
      typography: { [key]: value },
      ...(key === 'bodyFont' ? { fontFamily: String(value) } : {}),
    });
  };

  const updateScale = (tag: string, field: string, value: string) => {
    const current = getScaleData(tag);
    updateTypography(tag, { ...current, [field]: value });
  };

  const updateButtonVariant = (variantKey: string, key: string, value: string) => {
    const variant = variantKey as 'primary' | 'secondary' | 'outline';
    const current = buttons[variant] || {};
    editorStore.updateGlobalTheme({
      buttons: { [variant]: { ...current, [key]: value } },
    });
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
      <div class="space-y-3">
        {#each colorFields as item}
          {@const val = getColorVal(item.key, item.defaultVal)}
          <div>
            <label for={`color-${item.key}`} class="block font-semibold text-base-content/80 mb-1">{item.label}</label>
            <div class="flex items-center gap-2">
              <input id={`color-${item.key}`} type="color" value={val} on:input={(e) => updateColor(item.key, e.currentTarget.value)} class="w-8 h-8 rounded border border-base-300 dark:border-slate-700 cursor-pointer bg-transparent" />
              <input type="text" value={val} on:input={(e) => updateColor(item.key, e.currentTarget.value)} class="flex-1 px-3 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content font-mono uppercase text-xs" />
            </div>
          </div>
        {/each}
      </div>
    {:else if activeTab === 'typography'}
      <div class="space-y-4">
        <div>
          <label for="typo-heading-font" class="block font-semibold text-base-content/80 mb-1">Font Family Heading</label>
          <select id="typo-heading-font" value={typography.headingFont || 'Inter, sans-serif'} on:change={(e) => updateTypography('headingFont', e.currentTarget.value)} class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none">
            {#each fontOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
          </select>
        </div>
        <div>
          <label for="typo-body-font" class="block font-semibold text-base-content/80 mb-1">Font Family Body</label>
          <select id="typo-body-font" value={typography.bodyFont || 'Inter, sans-serif'} on:change={(e) => updateTypography('bodyFont', e.currentTarget.value)} class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none">
            {#each fontOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
          </select>
        </div>

        <div class="pt-2 border-t border-base-200 dark:border-slate-800 space-y-2.5">
          <span class="block font-bold text-xs text-base-content uppercase tracking-wider">Skala Tipografi</span>
          {#each typographyScales as scale}
            {@const scaleData = getScaleData(scale.tag)}
            <div class="p-2 bg-base-200/40 dark:bg-slate-900/60 rounded-lg border border-base-300 dark:border-slate-800 space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="font-semibold text-base-content text-[11px]">{scale.label}</span>
                <span class="font-mono text-[10px] text-blue-500">{scaleData.fontSize || scale.defaultSize}</span>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <input type="text" value={scaleData.fontSize || scale.defaultSize} on:change={(e) => updateScale(scale.tag, 'fontSize', e.currentTarget.value)} class="w-full px-2 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded text-xs font-mono" />
                <select value={scaleData.fontWeight || scale.defaultWeight} on:change={(e) => updateScale(scale.tag, 'fontWeight', e.currentTarget.value)} class="w-full px-2 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded text-xs">
                  <option value="400">Normal (400)</option><option value="500">Medium (500)</option><option value="600">Semibold (600)</option><option value="700">Bold (700)</option><option value="800">Extrabold (800)</option>
                </select>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {:else if activeTab === 'buttons'}
      <div class="space-y-4">
        <div>
          <span class="block font-semibold text-base-content/80 mb-1">Global Border Radius</span>
          <div class="grid grid-cols-3 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800 text-[11px]">
            {#each radiusPresets as rp}
              <button type="button" on:click={() => editorStore.updateGlobalTheme({ buttons: { borderRadius: rp.value } })} class={`py-1 rounded font-medium transition-colors cursor-pointer ${(buttons.borderRadius || '8px') === rp.value ? 'bg-base-100 text-blue-600 dark:text-blue-400 font-bold shadow-sm' : 'text-base-content/60 hover:text-base-content'}`}>{rp.label}</button>
            {/each}
          </div>
        </div>

        <div class="pt-2 border-t border-base-200 dark:border-slate-800 space-y-3">
          {#each [
            { key: 'primary', label: 'Primary Button', defaultBg: '#3b82f6', defaultText: '#ffffff' },
            { key: 'secondary', label: 'Secondary Button', defaultBg: '#f1f5f9', defaultText: '#0f172a' }
          ] as b}
            {@const bData = getButtonVariant(b.key)}
            <div class="p-3 bg-base-200/40 dark:bg-slate-900/60 rounded-lg border border-base-300 dark:border-slate-800 space-y-2">
              <span class="font-semibold text-base-content text-[11px]">{b.label}</span>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <span class="text-[10px] text-base-content/60">Background</span>
                  <div class="flex items-center gap-1.5 mt-0.5">
                    <input type="color" value={bData.backgroundColor || b.defaultBg} on:input={(e) => updateButtonVariant(b.key, 'backgroundColor', e.currentTarget.value)} class="w-6 h-6 rounded border border-base-300 dark:border-slate-700 cursor-pointer" />
                    <span class="font-mono text-[10px]">{bData.backgroundColor || b.defaultBg}</span>
                  </div>
                </div>
                <div>
                  <span class="text-[10px] text-base-content/60">Warna Teks</span>
                  <div class="flex items-center gap-1.5 mt-0.5">
                    <input type="color" value={bData.textColor || b.defaultText} on:input={(e) => updateButtonVariant(b.key, 'textColor', e.currentTarget.value)} class="w-6 h-6 rounded border border-base-300 dark:border-slate-700 cursor-pointer" />
                    <span class="font-mono text-[10px]">{bData.textColor || b.defaultText}</span>
                  </div>
                </div>
              </div>
            </div>
          {/each}

          <div class="p-3 bg-base-200/40 dark:bg-slate-900/60 rounded-lg border border-base-300 dark:border-slate-800 space-y-2">
            <span class="font-semibold text-base-content text-[11px]">Outline Button</span>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <span class="text-[10px] text-base-content/60">Warna Border</span>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <input type="color" value={buttons.outline?.borderColor || '#3b82f6'} on:input={(e) => updateButtonVariant('outline', 'borderColor', e.currentTarget.value)} class="w-6 h-6 rounded border border-base-300 dark:border-slate-700 cursor-pointer" />
                  <span class="font-mono text-[10px]">{buttons.outline?.borderColor || '#3b82f6'}</span>
                </div>
              </div>
              <div>
                <span class="text-[10px] text-base-content/60">Warna Teks</span>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <input type="color" value={buttons.outline?.textColor || '#3b82f6'} on:input={(e) => updateButtonVariant('outline', 'textColor', e.currentTarget.value)} class="w-6 h-6 rounded border border-base-300 dark:border-slate-700 cursor-pointer" />
                  <span class="font-mono text-[10px]">{buttons.outline?.textColor || '#3b82f6'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    {:else if activeTab === 'layout'}
      <div class="space-y-4">
        <div>
          <label for="layout-max-width" class="block font-semibold text-base-content/80 mb-1">Max-Width Konten Global</label>
          <select id="layout-max-width" value={layout.maxWidth || '1200px'} on:change={(e) => editorStore.updateGlobalTheme({ layout: { maxWidth: e.currentTarget.value } })} class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none">
            {#each maxWidthOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
          </select>
        </div>

        <div class="pt-2 border-t border-base-200 dark:border-slate-800 space-y-3">
          <span class="block font-bold text-xs text-base-content uppercase tracking-wider">Safe Zone Horizontal Margin</span>
          <div>
            <label for="layout-margin-desktop" class="block text-[11px] font-semibold text-base-content/80 mb-1">Desktop Margin (Safe Zone)</label>
            <input id="layout-margin-desktop" type="text" value={layout.horizontalMarginDesktop || '32px'} on:change={(e) => editorStore.updateGlobalTheme({ layout: { horizontalMarginDesktop: e.currentTarget.value } })} class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content text-xs font-mono" placeholder="32px" />
          </div>
          <div>
            <label for="layout-margin-tablet" class="block text-[11px] font-semibold text-base-content/80 mb-1">Tablet Margin (Safe Zone)</label>
            <input id="layout-margin-tablet" type="text" value={layout.horizontalMarginTablet || '24px'} on:change={(e) => editorStore.updateGlobalTheme({ layout: { horizontalMarginTablet: e.currentTarget.value } })} class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content text-xs font-mono" placeholder="24px" />
          </div>
          <div>
            <label for="layout-margin-mobile" class="block text-[11px] font-semibold text-base-content/80 mb-1">Mobile Margin (Safe Zone)</label>
            <input id="layout-margin-mobile" type="text" value={layout.horizontalMarginMobile || '16px'} on:change={(e) => editorStore.updateGlobalTheme({ layout: { horizontalMarginMobile: e.currentTarget.value } })} class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content text-xs font-mono" placeholder="16px" />
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

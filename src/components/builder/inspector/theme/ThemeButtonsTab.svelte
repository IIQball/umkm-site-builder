<script lang="ts">
  import type { TemplateTheme } from '@/schemas';

  export let theme: TemplateTheme;
  export let onButtonVariantChange: (variantKey: string, key: string, value: string) => void = () => {};
  export let onButtonRadiusChange: (value: string) => void = () => {};

  $: buttons = theme.buttons || {};

  const radiusPresets = [
    { label: 'Sharp', value: '0px' },
    { label: 'SM (4px)', value: '4px' },
    { label: 'MD (8px)', value: '8px' },
    { label: 'LG (16px)', value: '16px' },
    { label: 'Pill', value: '9999px' },
  ];

  const getButtonVariant = (key: string) => {
    return buttons[key as 'primary' | 'secondary'] || {};
  };
</script>

<div class="space-y-4">
  <div>
    <span class="block font-semibold text-base-content/80 mb-1">Global Border Radius</span>
    <div class="grid grid-cols-3 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800 text-[11px]">
      {#each radiusPresets as rp}
        <button
          type="button"
          on:click={() => onButtonRadiusChange(rp.value)}
          class={`py-1 rounded font-medium transition-colors cursor-pointer ${(buttons.borderRadius || '8px') === rp.value ? 'bg-base-100 text-blue-600 dark:text-blue-400 font-bold shadow-sm' : 'text-base-content/60 hover:text-base-content'}`}
        >
          {rp.label}
        </button>
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
              <input
                type="color"
                value={bData.backgroundColor || b.defaultBg}
                on:input={(e) => onButtonVariantChange(b.key, 'backgroundColor', e.currentTarget.value)}
                class="w-6 h-6 rounded border border-base-300 dark:border-slate-700 cursor-pointer"
              />
              <span class="font-mono text-[10px]">{bData.backgroundColor || b.defaultBg}</span>
            </div>
          </div>
          <div>
            <span class="text-[10px] text-base-content/60">Warna Teks</span>
            <div class="flex items-center gap-1.5 mt-0.5">
              <input
                type="color"
                value={bData.textColor || b.defaultText}
                on:input={(e) => onButtonVariantChange(b.key, 'textColor', e.currentTarget.value)}
                class="w-6 h-6 rounded border border-base-300 dark:border-slate-700 cursor-pointer"
              />
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
            <input
              type="color"
              value={buttons.outline?.borderColor || '#3b82f6'}
              on:input={(e) => onButtonVariantChange('outline', 'borderColor', e.currentTarget.value)}
              class="w-6 h-6 rounded border border-base-300 dark:border-slate-700 cursor-pointer"
            />
            <span class="font-mono text-[10px]">{buttons.outline?.borderColor || '#3b82f6'}</span>
          </div>
        </div>
        <div>
          <span class="text-[10px] text-base-content/60">Warna Teks</span>
          <div class="flex items-center gap-1.5 mt-0.5">
            <input
              type="color"
              value={buttons.outline?.textColor || '#3b82f6'}
              on:input={(e) => onButtonVariantChange('outline', 'textColor', e.currentTarget.value)}
              class="w-6 h-6 rounded border border-base-300 dark:border-slate-700 cursor-pointer"
            />
            <span class="font-mono text-[10px]">{buttons.outline?.textColor || '#3b82f6'}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

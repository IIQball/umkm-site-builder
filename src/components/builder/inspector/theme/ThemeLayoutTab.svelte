<script lang="ts">
  import type { TemplateTheme } from '@/schemas';

  export let theme: TemplateTheme;
  export let onLayoutChange: (key: string, value: string) => void = () => {};

  $: layout = theme.layout || {};
</script>

<div class="space-y-4">
  <div class="p-3 bg-base-200/40 rounded-xl border border-base-200 text-xs space-y-1">
    <div class="flex items-center justify-between font-semibold text-base-content">
      <span>Lebar Konten Global</span>
      <span class="badge badge-sm badge-neutral font-mono">1200px (Standar)</span>
    </div>
    <p class="text-[11px] text-base-content/60 leading-relaxed">
      Terkunci otomatis pada standar 1200px agar tampilan kisi dan seksi konsisten di semua layar.
    </p>
  </div>

  <div class="pt-2 border-t border-base-200 space-y-3">
    <span class="block font-bold text-xs text-base-content uppercase tracking-wider">Safe Zone Horizontal Margin</span>
    <div>
      <label for="layout-margin-desktop" class="block text-[11px] font-semibold text-base-content/80 mb-1">Desktop Margin (Safe Zone)</label>
      <input
        id="layout-margin-desktop"
        type="text"
        value={layout.horizontalMarginDesktop || '32px'}
        on:input={(e) => onLayoutChange('horizontalMarginDesktop', e.currentTarget.value)}
        on:change={(e) => onLayoutChange('horizontalMarginDesktop', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-base-content text-xs font-mono"
        placeholder="32px"
      />
    </div>
    <div>
      <label for="layout-margin-tablet" class="block text-[11px] font-semibold text-base-content/80 mb-1">Tablet Margin (Safe Zone)</label>
      <input
        id="layout-margin-tablet"
        type="text"
        value={layout.horizontalMarginTablet || '24px'}
        on:input={(e) => onLayoutChange('horizontalMarginTablet', e.currentTarget.value)}
        on:change={(e) => onLayoutChange('horizontalMarginTablet', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-base-content text-xs font-mono"
        placeholder="24px"
      />
    </div>
    <div>
      <label for="layout-margin-mobile" class="block text-[11px] font-semibold text-base-content/80 mb-1">Mobile Margin (Safe Zone)</label>
      <input
        id="layout-margin-mobile"
        type="text"
        value={layout.horizontalMarginMobile || '16px'}
        on:input={(e) => onLayoutChange('horizontalMarginMobile', e.currentTarget.value)}
        on:change={(e) => onLayoutChange('horizontalMarginMobile', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-base-content text-xs font-mono"
        placeholder="16px"
      />
    </div>
  </div>
</div>

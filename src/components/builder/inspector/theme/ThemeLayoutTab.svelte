<script lang="ts">
  import type { TemplateTheme } from '@/schemas';

  export let theme: TemplateTheme;
  export let onLayoutChange: (key: string, value: string) => void = () => {};

  $: layout = theme.layout || {};

  const toNumeric = (val: unknown, fallback: number): number => {
    if (typeof val === 'number') return val;
    if (!val) return fallback;
    const parsed = parseInt(String(val).replace(/[^\d]/g, ''), 10);
    return isNaN(parsed) ? fallback : parsed;
  };

  $: desktopMargin = toNumeric(layout.horizontalMarginDesktop, 32);
  $: tabletMargin = toNumeric(layout.horizontalMarginTablet, 24);
  $: mobileMargin = toNumeric(layout.horizontalMarginMobile, 16);

  function handleInput(key: string, rawVal: string, fallback: number) {
    const num = parseInt(rawVal.replace(/[^\d]/g, ''), 10);
    const safeNum = isNaN(num) ? fallback : Math.max(0, Math.min(240, num));
    onLayoutChange(key, `${safeNum}px`);
  }
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
      <div class="relative flex items-center">
        <input
          id="layout-margin-desktop"
          type="number"
          min="0"
          max="240"
          step="4"
          value={desktopMargin}
          on:input={(e) => handleInput('horizontalMarginDesktop', e.currentTarget.value, 32)}
          class="w-full pl-3 pr-8 py-2 bg-base-200/50 border border-base-300 rounded-lg text-base-content text-xs font-mono focus:outline-none focus:border-primary"
          placeholder="32"
        />
        <span class="absolute right-3 text-xs text-base-content/50 font-mono pointer-events-none select-none">px</span>
      </div>
    </div>
    <div>
      <label for="layout-margin-tablet" class="block text-[11px] font-semibold text-base-content/80 mb-1">Tablet Margin (Safe Zone)</label>
      <div class="relative flex items-center">
        <input
          id="layout-margin-tablet"
          type="number"
          min="0"
          max="240"
          step="4"
          value={tabletMargin}
          on:input={(e) => handleInput('horizontalMarginTablet', e.currentTarget.value, 24)}
          class="w-full pl-3 pr-8 py-2 bg-base-200/50 border border-base-300 rounded-lg text-base-content text-xs font-mono focus:outline-none focus:border-primary"
          placeholder="24"
        />
        <span class="absolute right-3 text-xs text-base-content/50 font-mono pointer-events-none select-none">px</span>
      </div>
    </div>
    <div>
      <label for="layout-margin-mobile" class="block text-[11px] font-semibold text-base-content/80 mb-1">Mobile Margin (Safe Zone)</label>
      <div class="relative flex items-center">
        <input
          id="layout-margin-mobile"
          type="number"
          min="0"
          max="240"
          step="4"
          value={mobileMargin}
          on:input={(e) => handleInput('horizontalMarginMobile', e.currentTarget.value, 16)}
          class="w-full pl-3 pr-8 py-2 bg-base-200/50 border border-base-300 rounded-lg text-base-content text-xs font-mono focus:outline-none focus:border-primary"
          placeholder="16"
        />
        <span class="absolute right-3 text-xs text-base-content/50 font-mono pointer-events-none select-none">px</span>
      </div>
    </div>
  </div>
</div>

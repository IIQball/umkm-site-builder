<script lang="ts">
  import { ShoppingBag } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import CatalogCtaPanel from './CatalogCtaPanel.svelte';

  export let section: TemplateSection;
  export let onConfigChange: (key: string, value: unknown) => void;

  $: cardPreset = String(section?.props?.cardPreset ?? section?.styles?.cardPreset ?? 'elevated_shadow');
  $: cardRadiusVal = String(section?.props?.cardRadius ?? section?.styles?.cardRadius ?? 'smooth');
  $: imageAspect = String(section?.props?.imageAspectRatio ?? section?.styles?.imageAspectRatio ?? 'square');
  $: badgePos = String(section?.props?.badgePosition ?? section?.styles?.badgePosition ?? 'top_left');
  $: badgeColor = String(section?.props?.badgeColor ?? section?.styles?.badgeColor ?? 'rose');
  $: pricePlacement = String(section?.props?.pricePlacement ?? section?.styles?.pricePlacement ?? 'stacked');
  $: ctaWidth = String(section?.props?.ctaButtonWidth ?? section?.styles?.ctaButtonWidth ?? 'full');
  $: ctaColor = String(section?.props?.ctaButtonColor ?? section?.styles?.ctaButtonColor ?? 'var(--theme-primary, #2563eb)');
  $: ctaRadius = String(section?.props?.ctaButtonRadius ?? section?.styles?.ctaButtonRadius ?? 'smooth');
  $: showWA = (section?.props?.showWhatsAppIcon ?? section?.styles?.showWhatsAppIcon) !== false;

  const cardPresets = [
    { key: 'minimal_bordered', title: 'Minimal Bordered', desc: 'Border tipis tanpa bayangan' },
    { key: 'elevated_shadow', title: 'Elevated Shadow', desc: 'Drop-shadow soft & modern' },
    { key: 'flat_filled', title: 'Flat / Filled', desc: 'Latar netral lembut' },
    { key: 'horizontal', title: 'Horizontal Split', desc: 'Foto di kiri, teks di kanan' },
  ];
</script>

<div class="space-y-4">
  <!-- Card Presets -->
  <div class="space-y-3 p-3 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/50 rounded-xl">
    <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 border-b border-emerald-200/60 dark:border-emerald-900/40 pb-1.5">
      <ShoppingBag size={14} class="text-emerald-600 dark:text-emerald-400" />
      <span>Bentuk & Varian Kartu</span>
    </div>

    <div class="grid grid-cols-2 gap-1.5">
      {#each cardPresets as preset}
        <button type="button" on:click={() => onConfigChange('cardPreset', preset.key)}
          class={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
            cardPreset === preset.key || (preset.key === 'elevated_shadow' && !cardPreset)
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-semibold ring-1 ring-emerald-500'
              : 'border-base-300 dark:border-slate-800 bg-base-100 text-base-content/80 hover:border-emerald-400'
          }`}>
          <p class="text-xs font-bold">{preset.title}</p>
          <p class="text-[10px] opacity-70 mt-0.5">{preset.desc}</p>
        </button>
      {/each}
    </div>

    <!-- Corner Radius -->
    <div>
      <span class="block font-semibold mb-1 text-base-content/90">Corner Radius (Nested 8pt)</span>
      <div class="grid grid-cols-4 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800">
        {#each [
          { key: 'sharp', label: '0px' },
          { key: 'rounded', label: '8px' },
          { key: 'smooth', label: '16px' },
          { key: 'extra_rounded', label: '24px' },
        ] as r}
          <button type="button" on:click={() => onConfigChange('cardRadius', r.key)}
            class={`py-1.5 text-[10px] font-semibold rounded transition-all cursor-pointer ${
              cardRadiusVal === r.key || (r.key === 'smooth' && !cardRadiusVal)
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-base-content/70 hover:text-base-content hover:bg-base-100/60'
            }`}>
            {r.label}
          </button>
        {/each}
      </div>
    </div>

    <!-- Image Aspect -->
    <div>
      <span class="block font-semibold mb-1 text-base-content/90">Rasio Foto Produk</span>
      <div class="grid grid-cols-4 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800">
        {#each [
          { key: 'square', label: '1:1' },
          { key: 'portrait', label: '3:4' },
          { key: 'widescreen', label: '16:9' },
          { key: 'auto', label: 'Auto' },
        ] as a}
          <button type="button" on:click={() => onConfigChange('imageAspectRatio', a.key)}
            class={`py-1.5 text-[10px] font-semibold rounded transition-all cursor-pointer ${
              imageAspect === a.key || (a.key === 'square' && !imageAspect)
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-base-content/70 hover:text-base-content hover:bg-base-100/60'
            }`}>
            {a.label}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <!-- Badge, Price & CTA WhatsApp Controls -->
  <CatalogCtaPanel
    {badgePos}
    {badgeColor}
    {pricePlacement}
    {ctaWidth}
    {ctaColor}
    {ctaRadius}
    {showWA}
    {onConfigChange}
  />
</div>

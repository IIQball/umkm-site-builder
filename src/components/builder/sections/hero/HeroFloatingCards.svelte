<script lang="ts">
  import HeroHeaderContent from './HeroHeaderContent.svelte';

  export let badgeText: string = '';
  export let tagName: string = 'h1';
  export let title: string = '';
  export let subtitle: string = '';
  export let ctaText: string = '';
  export let ctaLink: string = '#';
  export let secondaryCtaText: string = '';
  export let secondaryCtaLink: string = '#';
  export let waNumber: string = '';
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;
</script>

<div class="py-8 flex flex-col items-center text-center gap-8">
  <HeroHeaderContent
    {badgeText}
    {tagName}
    {title}
    {subtitle}
    {ctaText}
    {ctaLink}
    {secondaryCtaText}
    {secondaryCtaLink}
    {waNumber}
    {activeNodeId}
    {selectNode}
    {selectNodeKey}
    align="center"
  />

  <div class="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl">
    <div class="p-6 rounded-2xl bg-[var(--color-card-base,#ffffff)] border border-[var(--color-border,rgba(15,23,42,0.08))] shadow-xl rotate-0 sm:-rotate-2 transition-transform hover:rotate-0 flex flex-col text-left gap-2">
      <span class="text-2xl">✨</span>
      <h3 class="font-heading font-bold text-sm text-[var(--color-text-main,#0f172a)]">Produk Terkurasi</h3>
      <p class="text-xs text-[var(--color-text-secondary,#334155)] font-sans">Kualitas bahan terbaik standar nasional.</p>
    </div>
    <div class="p-6 rounded-2xl bg-[var(--color-card-base,#ffffff)] border border-[var(--color-border,rgba(15,23,42,0.08))] shadow-2xl scale-105 z-10 flex flex-col text-left gap-2">
      <span class="text-2xl">⚡</span>
      <h3 class="font-heading font-bold text-sm text-[var(--color-text-main,#0f172a)]">Pesan Instan</h3>
      <p class="text-xs text-[var(--color-text-secondary,#334155)] font-sans">Klik tombol WA langsung terhubung ke admin.</p>
    </div>
    <div class="p-6 rounded-2xl bg-[var(--color-card-base,#ffffff)] border border-[var(--color-border,rgba(15,23,42,0.08))] shadow-xl rotate-0 sm:rotate-2 transition-transform hover:rotate-0 flex flex-col text-left gap-2">
      <span class="text-2xl">🛡️</span>
      <h3 class="font-heading font-bold text-sm text-[var(--color-text-main,#0f172a)]">Garansi 100%</h3>
      <p class="text-xs text-[var(--color-text-secondary,#334155)] font-sans">Barang rusak langsung kami ganti baru.</p>
    </div>
  </div>
</div>

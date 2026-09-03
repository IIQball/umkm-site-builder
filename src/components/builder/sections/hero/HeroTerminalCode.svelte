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

<div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-6 text-left">
  <div class="md:col-span-6">
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
      align="left"
    />
  </div>

  <div class="md:col-span-6 w-full">
    <div class="rounded-2xl bg-slate-950 text-slate-200 border border-slate-800 shadow-2xl p-5 font-mono text-xs overflow-hidden">
      <div class="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800">
        <div class="w-3 h-3 rounded-full bg-red-500"></div>
        <div class="w-3 h-3 rounded-full bg-amber-500"></div>
        <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
        <span class="text-[10px] text-slate-500 ml-2">store-system.sh</span>
      </div>
      <p class="text-slate-400">$ check --stock ready</p>
      <p class="text-emerald-400">✓ Seluruh produk terverifikasi & siap kirim</p>
      <p class="text-slate-400 mt-2">$ order --instant-whatsapp</p>
      <p class="text-blue-400">✓ Integrasi otomatis pesan WA tanpa ribet</p>
      <p class="text-slate-500 mt-3 animate-pulse">_ Siap melayani pelanggan...</p>
    </div>
  </div>
</div>

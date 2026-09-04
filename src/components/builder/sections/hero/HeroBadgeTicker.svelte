<script lang="ts">
  import HeroHeaderContent from './HeroHeaderContent.svelte';

  export let badgeText: string = '🌿 Organik & Higienis';
  export let tagName: string = 'h1';
  export let title: string = 'Kemasan Aman, Nutrisi Alami Terjaga Utuh';
  export let subtitle: string = 'Diproduksi dengan standar keamanan pangan tertinggi. Cocok untuk konsumsi harian keluarga dan oleh-oleh premium.';
  export let ctaText: string = 'Pesan Sekarang';
  export let ctaLink: string = '#';
  export let secondaryCtaText: string = 'Sertifikasi Kami';
  export let secondaryCtaLink: string = '#certification';
  export let imageUrl: string = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80';
  export let waNumber: string = '';
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;

  $: isImageActive = activeNodeId === 'hero_image' || activeNodeId === 'image';
</script>

<div class="py-10">
  <div class="cq-grid-split items-center gap-8">
    <div class="text-left space-y-6">
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

      <div class="flex flex-wrap items-center gap-4 pt-4 border-t border-[var(--color-border,rgba(15,23,42,0.08))] text-xs text-[var(--color-text-secondary,#334155)] font-medium">
        <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Halal MUI</span>
        <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Izin BPOM RI</span>
        <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> P-IRT Terdaftar</span>
      </div>
    </div>

    <div
      data-node="image"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'hero_image')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_image')}
      class={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-slate-100 dark:bg-slate-800 transition-all cursor-pointer ${
        isImageActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
          : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
      }`}
    >
      <img src={imageUrl} alt={title} class="w-full h-full object-cover" />
      <div class="absolute top-4 right-4 w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold text-center leading-tight shadow-lg rotate-12">
        100%<br />ASLI
      </div>
    </div>
  </div>
</div>

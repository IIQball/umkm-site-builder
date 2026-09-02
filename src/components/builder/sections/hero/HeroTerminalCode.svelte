<script lang="ts">
  import { Terminal, ArrowRight } from 'lucide-svelte';

  export let badgeText: string = '';
  export let tagName: string = 'h1';
  export let title: string = '';
  export let subtitle: string = '';
  export let ctaText: string = '';
  export let ctaLink: string = '';
</script>

<div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-6 text-left">
  <div class="md:col-span-6 flex flex-col gap-4">
    {#if badgeText}
      <div data-node="badge" class="inline-flex items-center gap-1.5 px-3.5 h-7 rounded-full bg-slate-900 text-slate-100 text-xs font-mono font-bold w-fit">
        <Terminal size={12} class="text-emerald-400" />
        <span>{badgeText}</span>
      </div>
    {/if}
    <svelte:element this={tagName || 'h1'} data-node="title" class="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight leading-tight">
      {title}
    </svelte:element>
    <p data-node="subtitle" class="text-sm sm:text-base text-[var(--theme-text-muted,#64748b)] leading-relaxed">
      {subtitle}
    </p>
    {#if ctaText}
      <div data-node="cta" class="pt-2">
        <a
          href={ctaLink}
          style="height: var(--theme-btn-height, 44px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
          class="inline-flex items-center justify-center px-6 font-bold text-xs shadow-md active:scale-95 transition-transform"
        >
          <span>{ctaText}</span>
          <ArrowRight size={14} class="ml-2" />
        </a>
      </div>
    {/if}
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

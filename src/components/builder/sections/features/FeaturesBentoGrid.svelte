<script lang="ts">
  import type { ComponentType } from 'svelte';
  import { Sparkles } from 'lucide-svelte';

  export let features: any[] = [];
  export let title: string = '';
  export let subtitle: string = '';
  export let renderIcon: (name?: string) => ComponentType;
</script>

<div class="py-12 flex flex-col gap-8 text-left">
  <div class="text-center max-w-2xl mx-auto">
    <h2 class="text-2xl sm:text-3xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight mb-2">
      {title || 'Mengapa Memilih Produk Kami?'}
    </h2>
    <p class="text-sm text-[var(--theme-text-muted,#64748b)]">
      {subtitle || 'Perpaduan mutu premium dan pelayanan prima.'}
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- Spotlight Card (Spans 2 cols) -->
    <div class="md:col-span-2 p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl flex flex-col justify-between gap-6 relative overflow-hidden">
      <div class="flex items-center justify-between">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white">
          <Sparkles size={12} /> Fitur Unggulan
        </span>
      </div>
      <div>
        <h3 class="text-2xl sm:text-3xl font-black mb-3 text-white">
          {features[0]?.title || 'Jaminan Kualitas Terstandar'}
        </h3>
        <p class="text-sm sm:text-base text-blue-100 max-w-lg leading-relaxed">
          {features[0]?.description || 'Setiap pesanan melewati pemeriksaan ketat sebelum dikirimkan ke tangan Anda.'}
        </p>
      </div>
    </div>

    <!-- Secondary Cards -->
    {#each features.slice(1) as feature}
      <div class="p-6 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-4">
        <div class="w-12 h-12 rounded-lg bg-blue-50 text-[var(--theme-primary,#2563eb)] flex items-center justify-center border border-blue-100">
          <svelte:component this={renderIcon(feature.icon)} size={22} />
        </div>
        <div>
          <h4 class="font-bold text-base text-[var(--theme-text-primary,#0f172a)] mb-1">{feature.title}</h4>
          <p class="text-xs text-[var(--theme-text-muted,#64748b)] leading-relaxed">{feature.description}</p>
        </div>
      </div>
    {/each}
  </div>
</div>

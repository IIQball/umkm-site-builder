<script lang="ts">
  export let badgeText: string = '';
  export let tagName: string = 'h1';
  export let title: string = '';
  export let subtitle: string = '';
  export let ctaText: string = '';
  export let ctaLink: string = '';
</script>

<div class="py-8 flex flex-col items-center text-center gap-8">
  <div class="max-w-2xl flex flex-col items-center gap-3">
    {#if badgeText}
      <span data-node="badge" class="px-4 py-1 rounded-full bg-blue-50 text-[var(--theme-primary,#2563eb)] text-xs font-bold border border-blue-200">{badgeText}</span>
    {/if}
    <svelte:element this={tagName || 'h1'} data-node="title" class="text-3xl sm:text-5xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight">
      {title}
    </svelte:element>
    <p data-node="subtitle" class="text-sm text-[var(--theme-text-muted,#64748b)] max-w-xl">{subtitle}</p>
  </div>

  <div class="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl">
    <div class="p-6 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-xl rotate-0 sm:-rotate-2 transition-transform hover:rotate-0 flex flex-col text-left gap-2">
      <span class="text-2xl">✨</span>
      <h4 class="font-bold text-sm text-[var(--theme-text-primary,#0f172a)]">Produk Terkurasi</h4>
      <p class="text-xs text-[var(--theme-text-muted,#64748b)]">Kualitas bahan terbaik standar nasional.</p>
    </div>
    <div class="p-6 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-2xl scale-105 z-10 flex flex-col text-left gap-2">
      <span class="text-2xl">⚡</span>
      <h4 class="font-bold text-sm text-[var(--theme-text-primary,#0f172a)]">Pesan Instan</h4>
      <p class="text-xs text-[var(--theme-text-muted,#64748b)]">Klik tombol WA langsung terhubung ke admin.</p>
    </div>
    <div class="p-6 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-xl rotate-0 sm:rotate-2 transition-transform hover:rotate-0 flex flex-col text-left gap-2">
      <span class="text-2xl">🛡️</span>
      <h4 class="font-bold text-sm text-[var(--theme-text-primary,#0f172a)]">Garansi 100%</h4>
      <p class="text-xs text-[var(--theme-text-muted,#64748b)]">Barang rusak langsung kami ganti baru.</p>
    </div>
  </div>

  {#if ctaText}
    <a
      href={ctaLink}
      style="height: var(--theme-btn-height, 48px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
      class="inline-flex items-center justify-center px-8 font-bold text-sm shadow-md active:scale-95 transition-transform"
    >
      <span>{ctaText}</span>
    </a>
  {/if}
</div>

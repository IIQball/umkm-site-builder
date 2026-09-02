<script lang="ts">
  import { Mail } from 'lucide-svelte';

  export let badgeText: string = '';
  export let tagName: string = 'h1';
  export let title: string = '';
  export let subtitle: string = '';
  export let ctaText: string = '';
  export let ctaLink: string = '';
</script>

<div class="max-w-3xl mx-auto py-12 flex flex-col items-center text-center gap-6">
  {#if badgeText}
    <span data-node="badge" class="px-4 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">{badgeText}</span>
  {/if}
  <svelte:element this={tagName || 'h1'} data-node="title" class="text-3xl sm:text-5xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight leading-tight">
    {title}
  </svelte:element>
  <p data-node="subtitle" class="text-sm sm:text-base text-[var(--theme-text-muted,#64748b)] max-w-xl">
    {subtitle}
  </p>

  <!-- Inline Subscribe Form -->
  <div class="w-full max-w-md flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-md">
    <div class="flex items-center gap-2 px-3 flex-1 w-full text-slate-400">
      <Mail size={16} />
      <input
        type="text"
        placeholder="No. WhatsApp / Email Anda"
        class="w-full bg-transparent text-xs text-[var(--theme-text-primary,#0f172a)] focus:outline-none placeholder:text-slate-400"
      />
    </div>
    <a
      href={ctaLink}
      style="height: var(--theme-btn-height, 40px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
      class="w-full sm:w-auto px-6 inline-flex items-center justify-center font-bold text-xs shadow-sm hover:brightness-105 active:scale-95 transition-all flex-shrink-0"
    >
      <span>{ctaText || 'Daftar Promo'}</span>
    </a>
  </div>
</div>

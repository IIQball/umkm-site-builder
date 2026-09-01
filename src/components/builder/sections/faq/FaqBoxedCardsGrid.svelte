<script lang="ts">
  import { Sparkles } from 'lucide-svelte';
  import type { FAQItem } from '@/types';

  export let props: any;
  export let faqs: FAQItem[] = [];
</script>

<div class="flex flex-col gap-8 text-left">
  <div class="text-center max-w-2xl mx-auto space-y-2">
    <h2 class="text-2xl sm:text-3xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight">
      {props?.title || 'Pertanyaan yang Sering Diajukan'}
    </h2>
    <p class="text-sm text-[var(--theme-text-muted,#64748b)]">
      {props?.subtitle || 'Informasi lengkap terkait pemesanan, pengiriman, dan layanan purnajual.'}
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each faqs as faq}
      <div class="p-6 rounded-2xl bg-[var(--theme-surface,#ffffff)] border border-base-200 dark:border-slate-800 shadow-xs hover:border-[var(--theme-primary,#2563eb)]/40 transition-colors flex flex-col gap-2.5">
        <h3 class="font-bold text-sm text-[var(--theme-text-primary,#0f172a)] flex items-start gap-2">
          <span class="p-1 rounded-md bg-[var(--theme-primary,#2563eb)]/10 text-[var(--theme-primary,#2563eb)] shrink-0 mt-0.5">
            <Sparkles size={12} />
          </span>
          <span>{faq.question}</span>
        </h3>
        <p class="text-xs sm:text-sm text-[var(--theme-text-muted,#64748b)] leading-relaxed pl-6">
          {faq.answer}
        </p>
      </div>
    {/each}
  </div>
</div>

<script lang="ts">
  import type { FAQItem } from '@/types';

  export let faqs: FAQItem[] = [];
  export let title: string = '';
</script>

<div class="max-w-2xl mx-auto flex flex-col gap-6 text-left">
  <div class="text-center">
    <h2 class="text-2xl sm:text-3xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight mb-1">
      {title || 'Obrolan Tanya Jawab'}
    </h2>
    <p class="text-xs text-[var(--theme-text-muted,#64748b)]">Percakapan bantuan dan solusi instan</p>
  </div>

  <div class="flex flex-col gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
    {#each faqs as item}
      <div class="flex flex-col gap-2">
        <div class="self-end max-w-[85%] p-3.5 rounded-2xl rounded-tr-sm bg-[var(--theme-primary,#2563eb)] text-white text-xs font-medium shadow-sm">
          ❓ {item.question}
        </div>
        <div class="self-start max-w-[85%] p-3.5 rounded-2xl rounded-tl-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-[var(--theme-text-primary,#0f172a)] shadow-sm leading-relaxed">
          💬 {item.answer}
        </div>
      </div>
    {/each}
  </div>
</div>

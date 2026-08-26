<script lang="ts">
  import { HelpCircle } from 'lucide-svelte';
  import type { FAQItem } from '@/types';

  export let faqs: FAQItem[];
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  {#each faqs as item}
    <div
      class="p-6 rounded-2xl border border-base-200 dark:border-slate-800 space-y-3 transition-all hover:shadow-lg"
      style="background-color: var(--theme-surface);"
    >
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
          <HelpCircle size={16} />
        </div>
        <div class="space-y-2 flex-1">
          <h3 class="font-bold text-sm text-base-content leading-snug">
            {item.question}
          </h3>
          <p class="text-xs text-base-content/70 leading-relaxed">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  {/each}
</div>

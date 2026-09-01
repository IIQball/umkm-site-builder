<script lang="ts">
  import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-svelte';
  import type { FAQItem } from '@/types';

  export let props: any;
  export let faqs: FAQItem[] = [];
  export let waNumber: string = '';
  export let expandedIndex: number | null = 0;
  export let onToggle: (idx: number) => void;
</script>

<div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-left">
  <div class="md:col-span-5 flex flex-col gap-4">
    <h2 class="text-2xl sm:text-3xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight">
      {props?.title || 'Pertanyaan Umum'}
    </h2>
    <p class="text-sm text-[var(--theme-text-muted,#64748b)] leading-relaxed">
      {props?.subtitle || 'Temukan jawaban cepat atas pertanyaan yang sering diajukan seputar produk & layanan kami.'}
    </p>

    <div class="mt-2 p-6 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm flex flex-col gap-3">
      <div class="flex items-center gap-2 text-sm font-bold text-[var(--theme-primary,#2563eb)]">
        <HelpCircle size={18} />
        <span>Butuh Bantuan Langsung?</span>
      </div>
      <p class="text-xs text-[var(--theme-text-muted,#64748b)] leading-relaxed">
        Tim customer service kami siap membantu Anda setiap hari pukul 08:00 - 21:00 WIB.
      </p>
      <a
        href="https://wa.me/{waNumber}"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
      >
        <MessageCircle size={14} />
        <span>Chat WhatsApp Customer Service</span>
      </a>
    </div>
  </div>

  <div class="md:col-span-7 flex flex-col gap-3">
    {#each faqs as faq, i}
      {@const isOpen = expandedIndex === i}
      <div class="rounded-2xl border border-base-200 dark:border-slate-800 overflow-hidden bg-[var(--theme-surface,#ffffff)] transition-all">
        <button
          type="button"
          on:click={() => onToggle(i)}
          class="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-bold text-sm text-[var(--theme-text-primary,#0f172a)] hover:text-[var(--theme-primary,#2563eb)] transition-colors cursor-pointer"
        >
          <span>{faq.question}</span>
          <span class="p-1 rounded-lg bg-base-100 dark:bg-slate-800 text-muted transition-transform duration-200" class:rotate-180={isOpen}>
            <ChevronDown size={16} />
          </span>
        </button>
        {#if isOpen}
          <div class="px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--theme-text-muted,#64748b)] leading-relaxed border-t border-base-100 dark:border-slate-800/60">
            {faq.answer}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

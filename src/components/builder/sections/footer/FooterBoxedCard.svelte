<script lang="ts">
  import { MessageCircle, ShoppingBag } from 'lucide-svelte';

  export let boxedOfficialBadge: string = 'Gerai Resmi UMKM';
  export let brandName: string;
  export let tagline: string;
  export let boxedPrimaryCtaText: string = 'Katalog Resmi';
  export let boxedPrimaryCtaLink: string = '#products';
  export let boxedSecondaryCtaText: string = 'Konsultasi Pesanan';
  export let whatsappLink: string;
  export let copyrightText: string;
  export let activeNodeId: string | null = null;
  export let selectNode: (e: MouseEvent | KeyboardEvent, key: string) => void = () => {};
</script>

<div class="py-2">
  <div class="bg-[var(--color-card-base,var(--theme-surface,#ffffff))] rounded-3xl shadow-md border border-[var(--color-border,rgba(15,23,42,0.08))] p-6 sm:p-8">
    <div class="cq-footer-row-compact text-left">
      <!-- Identitas Brand & Toko -->
      <div
        class="space-y-1 p-2 rounded-2xl transition-all cursor-pointer {activeNodeId === 'footer_brand' ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''}"
        on:click={(e) => selectNode(e, 'footer_brand')}
        on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_brand')}
        role="button"
        tabindex="0"
      >
        <span
          class="font-[var(--theme-font-heading,var(--font-heading,inherit))] font-bold text-[var(--theme-primary,#2563eb)] uppercase tracking-wider block"
          style="font-size: var(--theme-text-caption, var(--text-caption-size, 12px));"
        >
          {boxedOfficialBadge}
        </span>
        <h4
          class="font-[var(--theme-font-heading,var(--font-heading,inherit))] text-[var(--color-text-main,var(--theme-text-primary,#0f172a))] mt-0.5"
          style="font-size: var(--theme-text-h3, var(--text-h3-size, 20px)); font-weight: var(--theme-text-h3-weight, var(--text-h3-weight, 700));"
        >
          {brandName}
        </h4>
        <p
          class="text-[var(--color-text-secondary,var(--theme-text-muted,#64748b))] max-w-md mt-1 font-[var(--theme-font-body,var(--font-family,inherit))] leading-relaxed"
          style="font-size: var(--theme-text-body, var(--text-body-size, 14px));"
        >
          {tagline}
        </p>
      </div>

      <!-- Action Buttons -->
      <div
        class="flex flex-col sm:flex-row gap-2.5 shrink-0 p-2 rounded-2xl transition-all cursor-pointer {activeNodeId === 'footer_contact' ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''}"
        on:click={(e) => selectNode(e, 'footer_contact')}
        on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_contact')}
        role="button"
        tabindex="0"
      >
        <a
          href={boxedPrimaryCtaLink}
          class="h-10 px-5 rounded-[var(--btn-radius,var(--theme-btn-radius,16px))] bg-[var(--btn-secondary-bg,var(--theme-btn-secondary-bg,#f1f5f9))] hover:opacity-90 text-[var(--btn-secondary-text,var(--theme-btn-secondary-text,#0f172a))] font-[var(--theme-font-heading,var(--font-heading,inherit))] font-bold inline-flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all border border-[var(--theme-btn-outline-border,transparent)]"
          style="font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.9);"
          on:click|stopPropagation
        >
          <ShoppingBag size={14} />
          <span>{boxedPrimaryCtaText}</span>
        </a>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          class="h-10 px-5 rounded-[var(--btn-radius,var(--theme-btn-radius,16px))] bg-[var(--btn-primary-bg,var(--theme-btn-primary-bg,var(--theme-primary,#2563eb)))] hover:opacity-90 text-[var(--btn-primary-text,var(--theme-btn-primary-text,#ffffff))] font-[var(--theme-font-heading,var(--font-heading,inherit))] font-bold inline-flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all shadow-xs"
          style="font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.9);"
          on:click|stopPropagation
        >
          <MessageCircle size={14} />
          <span>{boxedSecondaryCtaText}</span>
        </a>
      </div>
    </div>

    <!-- Bottom Copyright -->
    <div
      class="border-t border-[var(--color-border,rgba(15,23,42,0.08))] mt-6 pt-4 text-[var(--color-text-secondary,var(--theme-text-muted,#64748b))] text-left p-2 rounded-xl transition-all cursor-pointer font-[var(--theme-font-body,var(--font-family,inherit))] {activeNodeId === 'footer_copyright' ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''}"
      style="font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.85);"
      on:click={(e) => selectNode(e, 'footer_copyright')}
      on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_copyright')}
      role="button"
      tabindex="0"
    >
      {copyrightText}
    </div>
  </div>
</div>

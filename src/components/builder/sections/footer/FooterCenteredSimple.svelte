<script lang="ts">
  import { MessageCircle } from 'lucide-svelte';

  export let brandName: string;
  export let tagline: string;
  export let logoImageUrl: string = '';
  export let whatsappLink: string;
  export let chatButtonText: string = 'Chat Admin Pemesanan';
  export let copyrightText: string;
  export let activeNodeId: string | null = null;
  export let selectNode: (e: MouseEvent | KeyboardEvent, key: string) => void = () => {};
</script>

<div class="max-w-lg mx-auto space-y-4 text-center py-2">
  <div
    class="space-y-3 rounded-2xl p-3 transition-all cursor-pointer {activeNodeId === 'footer_brand' ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''}"
    on:click={(e) => selectNode(e, 'footer_brand')}
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_brand')}
    role="button"
    tabindex="0"
  >
    <div class="flex items-center justify-center gap-2">
      {#if logoImageUrl}
        <img src={logoImageUrl} alt={brandName} class="w-9 h-9 rounded-[var(--theme-btn-radius,var(--btn-radius,16px))] object-contain bg-[var(--theme-surface,var(--color-card-base,#ffffff))] border border-[var(--color-border,rgba(15,23,42,0.08))]" />
      {:else}
        <div class="w-9 h-9 rounded-[var(--theme-btn-radius,var(--btn-radius,16px))] bg-[var(--theme-primary,#2563eb)] text-[var(--theme-btn-primary-text,#ffffff)] flex items-center justify-center font-[var(--theme-font-heading,var(--font-heading,inherit))] font-bold text-sm shadow-xs">
          {brandName.charAt(0) || 'B'}
        </div>
      {/if}
      <span
        style="font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-h3, var(--text-h3-size, 20px)); font-weight: var(--theme-text-h3-weight, var(--text-h3-weight, 700)); color: var(--theme-text-primary, var(--color-text-main, #0f172a));"
      >
        {brandName}
      </span>
    </div>
    <p
      style="font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: var(--theme-text-body, var(--text-body-size, 14px)); color: var(--theme-text-muted, var(--color-text-secondary, #64748b));"
      class="leading-relaxed"
    >
      {tagline}
    </p>
  </div>

  <div
    class="pt-1 rounded-2xl p-2 transition-all cursor-pointer {activeNodeId === 'footer_contact' ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''}"
    on:click={(e) => selectNode(e, 'footer_contact')}
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_contact')}
    role="button"
    tabindex="0"
  >
    <a
      href={whatsappLink}
      target="_blank"
      rel="noreferrer"
      style="border-radius: var(--theme-btn-radius, var(--btn-radius, 16px)); background-color: var(--theme-btn-primary-bg, var(--btn-primary-bg, var(--theme-primary, #2563eb))); color: var(--theme-btn-primary-text, var(--btn-primary-text, #ffffff)); font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 12px));"
      class="inline-flex items-center justify-center gap-2 h-10 px-6 hover:opacity-90 font-bold shadow-xs active:scale-[0.98] transition-all"
      on:click|stopPropagation
    >
      <MessageCircle size={15} />
      <span>{chatButtonText}</span>
    </a>
  </div>

  <div
    class="pt-6 border-t border-[var(--color-border,rgba(15,23,42,0.08))] rounded-2xl p-2 transition-all cursor-pointer {activeNodeId === 'footer_copyright' ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''}"
    style="font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.85); color: var(--theme-text-muted, var(--color-text-secondary, #64748b));"
    on:click={(e) => selectNode(e, 'footer_copyright')}
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_copyright')}
    role="button"
    tabindex="0"
  >
    {copyrightText}
  </div>
</div>

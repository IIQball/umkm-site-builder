<script lang="ts">
  import { MessageCircle } from 'lucide-svelte';

  export let brandName: string;
  export let tagline: string;
  export let whatsappNumber: string;
  export let whatsappLink: string;
  export let copyrightText: string;
  export let activeNodeId: string | null = null;
  export let selectNode: (e: MouseEvent | KeyboardEvent, key: string) => void = () => {};
</script>

<div
  class="border border-[var(--color-border,rgba(15,23,42,0.08))] rounded-3xl p-6 sm:p-8 relative overflow-hidden text-left"
  style="background-color: var(--theme-surface, var(--color-card-base, #ffffff)); color: var(--theme-text-primary, var(--color-text-main, #0f172a));"
>
  <!-- Baris Atas Info & Link -->
  <div
    class="cq-footer-bottom-bar mb-8 items-start"
    style="font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: var(--theme-text-body, var(--text-body-size, 14px)); color: var(--theme-text-muted, var(--color-text-secondary, #64748b));"
  >
    <div
      class="max-w-xs space-y-2 p-2 rounded-xl transition-all cursor-pointer {activeNodeId === 'footer_brand' ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''}"
      on:click={(e) => selectNode(e, 'footer_brand')}
      on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_brand')}
      role="button"
      tabindex="0"
    >
      <p
        style="color: var(--theme-text-primary, var(--color-text-main, #0f172a)); line-height: 1.6;"
      >
        {tagline}
      </p>
      {#if whatsappNumber}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          style="color: var(--theme-primary, #2563eb); font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 12px));"
          class="inline-flex items-center gap-1.5 font-semibold hover:underline pt-1"
          on:click|stopPropagation
        >
          <MessageCircle size={14} />
          <span>Hubungi kami via WhatsApp</span>
        </a>
      {/if}
    </div>

    <div
      class="flex gap-4 p-2 rounded-xl transition-all cursor-pointer {activeNodeId === 'footer_contact' ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''}"
      on:click={(e) => selectNode(e, 'footer_contact')}
      on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_contact')}
      role="button"
      tabindex="0"
    >
      <a
        href="#products"
        style="color: var(--theme-text-primary, var(--color-text-main, #0f172a)); font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: var(--theme-text-body, var(--text-body-size, 14px));"
        class="hover:text-[var(--theme-primary,#2563eb)] transition-all"
        on:click|stopPropagation
      >
        Katalog Produk
      </a>
      <a
        href="#contact"
        style="color: var(--theme-text-primary, var(--color-text-main, #0f172a)); font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: var(--theme-text-body, var(--text-body-size, 14px));"
        class="hover:text-[var(--theme-primary,#2563eb)] transition-all"
        on:click|stopPropagation
      >
        Kontak Layanan
      </a>
    </div>
  </div>

  <!-- Giant Typography Wordmark Container -->
  <div
    class="border-t border-[var(--color-border,rgba(15,23,42,0.08))] pt-4 text-center overflow-hidden select-none cursor-pointer rounded-xl transition-all {activeNodeId === 'footer_copyright' ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''}"
    on:click={(e) => selectNode(e, 'footer_copyright')}
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_copyright')}
    role="button"
    tabindex="0"
  >
    <span class="cq-wordmark-text font-black font-sans text-[var(--color-border,rgba(15,23,42,0.12))] uppercase tracking-tighter block truncate transition-colors hover:text-[var(--theme-primary,#2563eb)]/30">
      {brandName}
    </span>
    <p
      style="font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.85); color: var(--theme-text-muted, var(--color-text-secondary, #64748b));"
      class="pt-2 text-center"
    >
      {copyrightText}
    </p>
  </div>
</div>

<script lang="ts">
  import { MessageCircle } from 'lucide-svelte';
  import { resolveFooterNodeStyle } from './footerStyles.helpers';

  export let brandName: string;
  export let tagline: string;
  export let whatsappNumber: string;
  export let whatsappLink: string;
  export let copyrightText: string;
  export let attributionText: string = 'Powered by Pinoka';
  export let activeNodeId: string | null = null;
  export let selectNode: (e: MouseEvent | KeyboardEvent, key: string) => void = () => {};
  export let nodeStyles: Record<string, Record<string, string>> = {};
  export let elementOrder: string[] = ['footer_brand', 'footer_contact', 'footer_copyright'];

  $: styleBrand = resolveFooterNodeStyle('footer_brand', nodeStyles);
  $: styleContact = resolveFooterNodeStyle('footer_contact', nodeStyles);
  $: styleCopyright = resolveFooterNodeStyle('footer_copyright', nodeStyles);

  $: hasBrand = !elementOrder.length || elementOrder.includes('footer_brand') || elementOrder.includes('brand_bio');
  $: hasContact = !elementOrder.length || elementOrder.includes('footer_contact') || elementOrder.includes('contact_info');
  $: hasCopyright = !elementOrder.length || elementOrder.includes('footer_copyright') || elementOrder.includes('copyright');
  $: hasTopBar = hasBrand || hasContact;
</script>

<div
  class="border border-[var(--color-border)] rounded-3xl p-6 sm:p-8 relative overflow-hidden text-left"
  style="background-color: var(--theme-surface, var(--color-card-base)); color: var(--theme-text-primary, var(--color-text-main));"
>
  {#if hasTopBar}
  <!-- Baris Atas Info & Link -->
  <div
    class="cq-footer-bottom-bar mb-8 items-start"
    style="font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: var(--theme-text-body, var(--text-body-size, 14px)); color: var(--theme-text-muted, var(--color-text-muted));"
  >
    {#if hasBrand}
    <div
      class="max-w-xs space-y-2 p-2 rounded-xl transition-all cursor-pointer {activeNodeId === 'footer_brand' ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''}"
      style="margin-top: {styleBrand.marginTop}; margin-bottom: {styleBrand.marginBottom};"
      on:click={(e) => selectNode(e, 'footer_brand')}
      on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_brand')}
      role="button"
      tabindex="0"
    >
      <p
        style="color: {styleBrand.color || 'var(--theme-text-primary, var(--color-text-main))'}; line-height: 1.6;"
      >
        {tagline}
      </p>
      {#if whatsappNumber}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          style="color: var(--theme-primary, var(--color-primary)); font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 12px));"
          class="inline-flex items-center gap-1.5 font-semibold hover:underline pt-1"
          on:click|stopPropagation
        >
          <MessageCircle size={14} />
          <span>Hubungi kami via WhatsApp</span>
        </a>
      {/if}
    </div>
    {/if}

    {#if hasContact}
    <div
      class="flex gap-4 p-2 rounded-xl transition-all cursor-pointer {activeNodeId === 'footer_contact' ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''}"
      style="margin-top: {styleContact.marginTop}; margin-bottom: {styleContact.marginBottom};"
      on:click={(e) => selectNode(e, 'footer_contact')}
      on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_contact')}
      role="button"
      tabindex="0"
    >
      <a
        href="#products"
        style="color: {styleContact.color || 'var(--theme-text-primary, var(--color-text-main))'}; font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: var(--theme-text-body, var(--text-body-size, 14px));"
        class="hover:text-[var(--theme-primary, var(--color-primary))] transition-all"
        on:click|stopPropagation
      >
        Katalog Produk
      </a>
      <a
        href="#contact"
        style="color: {styleContact.color || 'var(--theme-text-primary, var(--color-text-main))'}; font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: var(--theme-text-body, var(--text-body-size, 14px));"
        class="hover:text-[var(--theme-primary, var(--color-primary))] transition-all"
        on:click|stopPropagation
      >
        Kontak Layanan
      </a>
    </div>
    {/if}
  </div>
  {/if}

  {#if hasCopyright}
  <!-- Giant Typography Wordmark Container -->
  <div
    class="border-t border-[var(--color-border)] pt-4 text-center overflow-hidden select-none cursor-pointer rounded-xl transition-all {activeNodeId === 'footer_copyright' ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''}"
    style="margin-top: {styleCopyright.marginTop}; margin-bottom: {styleCopyright.marginBottom}; color: {styleCopyright.color || 'var(--theme-text-muted, var(--color-text-muted))'};"
    on:click={(e) => selectNode(e, 'footer_copyright')}
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_copyright')}
    role="button"
    tabindex="0"
  >
    <span class="cq-wordmark-text font-black font-heading text-[var(--color-border)] uppercase tracking-tighter block truncate transition-colors hover:text-[var(--theme-primary, var(--color-primary))]/30">
      {brandName}
    </span>
    <p
      style="font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.85);"
      class="pt-2 text-center"
    >
      {copyrightText}
    </p>
    <p
      style="font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.75);"
      class="pt-1 text-center opacity-80"
    >
      {attributionText}
    </p>
  </div>
  {/if}
</div>

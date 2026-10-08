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
  export let isLiveStorefront: boolean = false;

  $: styleBrand = resolveFooterNodeStyle('footer_brand', nodeStyles);
  $: styleContact = resolveFooterNodeStyle('footer_contact', nodeStyles);
  $: styleCopyright = resolveFooterNodeStyle('footer_copyright', nodeStyles);

  $: hasBrand = !elementOrder.length || elementOrder.includes('footer_brand') || elementOrder.includes('brand_bio');
  $: hasContact = !elementOrder.length || elementOrder.includes('footer_contact') || elementOrder.includes('contact_info');
  $: hasCopyright = !elementOrder.length || elementOrder.includes('footer_copyright') || elementOrder.includes('copyright');
  $: hasTopBar = hasBrand || hasContact;

  $: cleanBrandName = (brandName || 'NAMA TOKO').trim();
  $: charLength = Math.max(cleanBrandName.length, 6);
  $: dynamicWordmarkFontSize = `clamp(1rem, calc(86cqi / ${(charLength * 0.58).toFixed(2)}), 6.5rem)`;
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
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div
      class="max-w-xs space-y-2 p-2 rounded-xl transition-all {isLiveStorefront ? '' : 'cursor-pointer'} {activeNodeId === 'footer_brand' ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''}"
      style="margin-top: {styleBrand.marginTop}; margin-bottom: {styleBrand.marginBottom};"
      on:click={(e) => !isLiveStorefront && selectNode(e, 'footer_brand')}
      on:keydown={(e) => !isLiveStorefront && (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_brand')}
      role={isLiveStorefront ? undefined : 'button'}
      tabindex={isLiveStorefront ? undefined : 0}
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
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div
      class="flex gap-4 p-2 rounded-xl transition-all {isLiveStorefront ? '' : 'cursor-pointer'} {activeNodeId === 'footer_contact' ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''}"
      style="margin-top: {styleContact.marginTop}; margin-bottom: {styleContact.marginBottom};"
      on:click={(e) => !isLiveStorefront && selectNode(e, 'footer_contact')}
      on:keydown={(e) => !isLiveStorefront && (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_contact')}
      role={isLiveStorefront ? undefined : 'button'}
      tabindex={isLiveStorefront ? undefined : 0}
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
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <div
    class="border-t border-[var(--color-border)] pt-4 text-center overflow-hidden select-none rounded-xl transition-all {isLiveStorefront ? '' : 'cursor-pointer'} {activeNodeId === 'footer_copyright' ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''}"
    style="margin-top: {styleCopyright.marginTop}; margin-bottom: {styleCopyright.marginBottom}; color: {styleCopyright.color || 'var(--theme-text-muted, var(--color-text-muted))'};"
    on:click={(e) => !isLiveStorefront && selectNode(e, 'footer_copyright')}
    on:keydown={(e) => !isLiveStorefront && (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_copyright')}
    role={isLiveStorefront ? undefined : 'button'}
    tabindex={isLiveStorefront ? undefined : 0}
  >
    <span
      class="cq-wordmark-text font-black font-heading text-[var(--color-border)] uppercase tracking-tighter block transition-colors hover:text-[var(--theme-primary, var(--color-primary))]/30"
      style="font-size: {dynamicWordmarkFontSize}; line-height: 1; letter-spacing: -0.04em; white-space: nowrap; overflow: visible;"
    >
      {cleanBrandName}
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

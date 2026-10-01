<script lang="ts">
  import { MessageCircle } from 'lucide-svelte';
  import { resolveFooterNodeStyle } from './footerStyles.helpers';

  export let brandName: string;
  export let tagline: string;
  export let logoImageUrl: string = '';
  export let whatsappLink: string;
  export let chatButtonText: string = 'Chat Admin Pemesanan';
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
</script>

<div class="max-w-lg mx-auto space-y-4 text-center py-2">
  {#if hasBrand}
    <div
      class="space-y-3 rounded-2xl p-3 transition-all cursor-pointer {activeNodeId === 'footer_brand' ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''}"
    style="margin-top: {styleBrand.marginTop}; margin-bottom: {styleBrand.marginBottom};"
    on:click={(e) => selectNode(e, 'footer_brand')}
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_brand')}
    role="button"
    tabindex="0"
  >
    <div class="flex items-center justify-center gap-2">
      {#if logoImageUrl}
        <img src={logoImageUrl} alt={brandName} class="w-9 h-9 rounded-[var(--theme-btn-radius,var(--btn-radius,16px))] object-contain bg-[var(--theme-surface, var(--color-card-base))] border border-[var(--color-border)]" />
      {:else}
        <div class="w-9 h-9 rounded-[var(--theme-btn-radius,var(--btn-radius,16px))] bg-[var(--theme-primary, var(--color-primary))] text-[var(--theme-btn-primary-text, white)] flex items-center justify-center font-heading font-bold text-sm shadow-xs">
          {brandName.charAt(0) || 'B'}
        </div>
      {/if}
      <span
        class="font-heading"
        style="font-size: var(--theme-text-h3, var(--text-h3-size, 20px)); font-weight: var(--theme-text-h3-weight, var(--text-h3-weight, 700)); color: var(--theme-text-primary, var(--color-text-main));"
      >
        {brandName}
      </span>
    </div>
    <p
      style="font-size: var(--theme-text-body, var(--text-body-size, 14px)); color: {styleBrand.color || 'var(--theme-text-muted, var(--color-text-muted))'};"
      class="leading-relaxed"
    >
      {tagline}
    </p>
  </div>
  {/if}

  {#if hasContact}
  <div
    class="pt-1 rounded-2xl p-2 transition-all cursor-pointer {activeNodeId === 'footer_contact' ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''}"
    style="margin-top: {styleContact.marginTop}; margin-bottom: {styleContact.marginBottom};"
    on:click={(e) => selectNode(e, 'footer_contact')}
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_contact')}
    role="button"
    tabindex="0"
  >
    <a
      href={whatsappLink}
      target="_blank"
      rel="noreferrer"
      style="border-radius: var(--theme-btn-radius, var(--btn-radius, 16px)); background-color: var(--theme-btn-primary-bg, var(--btn-primary-bg, var(--theme-primary, var(--color-primary)))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white)); font-size: var(--theme-text-caption, var(--text-caption-size, 12px));"
      class="inline-flex items-center justify-center gap-2 h-10 px-6 hover:opacity-90 font-bold shadow-xs active:scale-[0.98] transition-all font-heading"
      on:click|stopPropagation
    >
      <MessageCircle size={15} />
      <span>{chatButtonText}</span>
    </a>
  </div>
  {/if}

  {#if hasCopyright}
  <div
    class="pt-6 border-t border-[var(--color-border)] rounded-2xl p-2 transition-all cursor-pointer space-y-1 {activeNodeId === 'footer_copyright' ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''}"
    style="margin-top: {styleCopyright.marginTop}; margin-bottom: {styleCopyright.marginBottom}; font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.85); color: {styleCopyright.color || 'var(--theme-text-muted, var(--color-text-muted))'};"
    on:click={(e) => selectNode(e, 'footer_copyright')}
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_copyright')}
    role="button"
    tabindex="0"
  >
    <p>{copyrightText}</p>
    <p style="font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.75);">{attributionText}</p>
  </div>
  {/if}
</div>

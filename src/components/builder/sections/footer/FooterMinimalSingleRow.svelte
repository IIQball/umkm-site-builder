<script lang="ts">
  import type { FooterSocialLink } from '@/types';
  import { resolveFooterNodeStyle } from './footerStyles.helpers';

  export let brandName: string;
  export let logoImageUrl: string = '';
  export let copyrightText: string;
  export let attributionText: string = 'Powered by Pinoka';
  export let socialLinks: FooterSocialLink[] = [];
  export let activeNodeId: string | null = null;
  export let selectNode: (e: MouseEvent | KeyboardEvent, key: string) => void = () => {};
  export let nodeStyles: Record<string, Record<string, string>> = {};
  export let elementOrder: string[] = ['footer_brand', 'footer_copyright', 'footer_contact'];

  $: styleBrand = resolveFooterNodeStyle('footer_brand', nodeStyles);
  $: styleContact = resolveFooterNodeStyle('footer_contact', nodeStyles);
  $: styleCopyright = resolveFooterNodeStyle('footer_copyright', nodeStyles);

  $: hasBrand = !elementOrder.length || elementOrder.includes('footer_brand') || elementOrder.includes('brand_bio');
  $: hasCopyright = !elementOrder.length || elementOrder.includes('footer_copyright') || elementOrder.includes('copyright');
  $: hasContact = !elementOrder.length || elementOrder.includes('footer_contact') || elementOrder.includes('contact_info');
</script>

<div
  class="cq-footer-row-compact py-3"
  style="font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.85); color: var(--theme-text-muted, var(--color-text-muted));"
>
  {#if hasBrand}
  <!-- Brand Kiri -->
  <div
    class="flex items-center gap-2 p-1.5 rounded-xl transition-all cursor-pointer {activeNodeId === 'footer_brand' ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''}"
    style="margin-top: {styleBrand.marginTop}; margin-bottom: {styleBrand.marginBottom};"
    on:click={(e) => selectNode(e, 'footer_brand')}
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_brand')}
    role="button"
    tabindex="0"
  >
    {#if logoImageUrl}
      <img src={logoImageUrl} alt={brandName} class="w-6 h-6 rounded-[var(--theme-btn-radius,var(--btn-radius,8px))] object-contain bg-[var(--theme-surface, var(--color-card-base))] border border-[var(--color-border)]" />
    {:else}
      <div class="w-6 h-6 rounded-[var(--theme-btn-radius,var(--btn-radius,8px))] bg-[var(--theme-primary, var(--color-primary))] text-[var(--theme-btn-primary-text, white)] flex items-center justify-center font-heading font-bold text-[10px] shadow-xs">
        {brandName.charAt(0) || 'H'}
      </div>
    {/if}
    <span
      class="font-heading"
      style="font-size: var(--theme-text-caption, var(--text-caption-size, 13px)); font-weight: 700; color: {styleBrand.color || 'var(--theme-text-primary, var(--color-text-main))'};"
    >
      {brandName}
    </span>
  </div>
  {/if}

  {#if hasCopyright}
  <!-- Copyright Tengah -->
  <div
    class="p-1.5 rounded-xl transition-all cursor-pointer {activeNodeId === 'footer_copyright' ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''}"
    style="margin-top: {styleCopyright.marginTop}; margin-bottom: {styleCopyright.marginBottom}; color: {styleCopyright.color || 'var(--theme-text-muted, var(--color-text-muted))'};"
    on:click={(e) => selectNode(e, 'footer_copyright')}
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_copyright')}
    role="button"
    tabindex="0"
  >
    <p>
      {copyrightText} <span class="opacity-60">•</span> {attributionText}
    </p>
  </div>
  {/if}

  {#if hasContact}
  <!-- Sosmed Kanan -->
  <div
    class="flex items-center gap-3 font-semibold p-1.5 rounded-xl transition-all cursor-pointer {activeNodeId === 'footer_contact' ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''}"
    style="margin-top: {styleContact.marginTop}; margin-bottom: {styleContact.marginBottom}; color: {styleContact.color || 'var(--theme-text-primary, var(--color-text-main))'};"
    on:click={(e) => selectNode(e, 'footer_contact')}
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_contact')}
    role="button"
    tabindex="0"
  >
    {#if socialLinks && socialLinks.length > 0}
      {#each socialLinks.slice(0, 3) as s, idx}
        {#if idx > 0}
          <span class="text-[var(--color-border)]">•</span>
        {/if}
        <a href={s.url} target="_blank" rel="noreferrer" class="hover:text-[var(--theme-primary, var(--color-primary))] transition-colors" on:click|stopPropagation>
          {s.label || s.platform}
        </a>
      {/each}
    {:else}
      <a href="#instagram" class="hover:text-[var(--theme-primary, var(--color-primary))] transition-colors" on:click|stopPropagation>Instagram</a>
      <span class="text-[var(--color-border)]">•</span>
      <a href="#whatsapp" class="hover:text-[var(--theme-primary, var(--color-primary))] transition-colors" on:click|stopPropagation>WhatsApp</a>
    {/if}
  </div>
  {/if}
</div>

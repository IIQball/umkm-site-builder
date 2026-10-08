<script lang="ts">
  import { MessageCircle, MapPin, Clock } from 'lucide-svelte';
  import type { FooterMenuLink } from '@/types';
  import { resolveFooterNodeStyle } from './footerStyles.helpers';

  export let brandName: string;
  export let tagline: string;
  export let logoImageUrl: string = '';
  export let address: string;
  export let storeHours: string;
  export let whatsappNumber: string;
  export let whatsappLink: string;
  export let menuLinks: FooterMenuLink[];
  export let copyrightText: string;
  export let attributionText: string = 'Powered by Pinoka';
  export let activeNodeId: string | null = null;
  export let selectNode: (e: MouseEvent | KeyboardEvent, key: string) => void = () => {};
  export let elementOrder: string[] = ['footer_brand', 'footer_contact', 'footer_navigation', 'footer_copyright'];
  export let nodeStyles: Record<string, Record<string, string>> = {};

  $: styleBrand = resolveFooterNodeStyle('footer_brand', nodeStyles);
  $: styleContact = resolveFooterNodeStyle('footer_contact', nodeStyles);
  $: styleNav = resolveFooterNodeStyle('footer_navigation', nodeStyles);
  $: styleCopyright = resolveFooterNodeStyle('footer_copyright', nodeStyles);

  $: effectiveOrder = Array.isArray(elementOrder) && elementOrder.length > 0
    ? elementOrder
    : ['footer_brand', 'footer_contact', 'footer_navigation', 'footer_copyright'];

  const getSlotOrder = (slot: string) => {
    const legacy = slot === 'footer_brand' ? 'brand_bio' : slot === 'footer_contact' ? 'contact_info' : slot === 'footer_navigation' ? 'navigation_links' : slot === 'footer_copyright' ? 'copyright' : slot;
    const modern = slot === 'brand_bio' ? 'footer_brand' : slot === 'contact_info' ? 'footer_contact' : slot === 'navigation_links' ? 'footer_navigation' : slot === 'copyright' ? 'footer_copyright' : slot;
    const idx = effectiveOrder.findIndex((s) => s === slot || s === legacy || s === modern);
    return idx === -1 ? 99 : idx;
  };

  $: columnsMinOrder = Math.min(
    getSlotOrder('footer_brand'),
    getSlotOrder('footer_contact'),
    getSlotOrder('footer_navigation')
  );
  $: copyrightOrder = getSlotOrder('footer_copyright');
  $: hasBrand = effectiveOrder.includes('footer_brand') || effectiveOrder.includes('brand_bio');
  $: hasContact = effectiveOrder.includes('footer_contact') || effectiveOrder.includes('contact_info');
  $: hasNav = effectiveOrder.includes('footer_navigation') || effectiveOrder.includes('navigation_links');
  $: hasCopyright = effectiveOrder.includes('footer_copyright') || effectiveOrder.includes('copyright');
  $: hasColumns = hasBrand || hasContact || hasNav;
</script>

<div class="flex flex-col w-full">
  {#if hasColumns}
    <div class="cq-footer-grid-3 text-left pb-8 border-b border-[var(--color-border)]" style="order: {columnsMinOrder};">
      {#if hasBrand}
        <!-- Kolom 1: Profil Toko -->
        <div
          style="order: {getSlotOrder('footer_brand')}; margin-top: {styleBrand.marginTop}; margin-bottom: {styleBrand.marginBottom};"
          class="space-y-3 rounded-2xl p-2.5 transition-all cursor-pointer {activeNodeId === 'footer_brand' ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''}"
      on:click={(e) => selectNode(e, 'footer_brand')}
      on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_brand')}
      role="button"
      tabindex="0"
    >
      <div class="flex items-center gap-2.5">
        {#if logoImageUrl}
          <img src={logoImageUrl} alt={brandName} class="w-8 h-8 rounded-[var(--theme-btn-radius,var(--btn-radius,12px))] object-contain bg-[var(--theme-surface, var(--color-card-base))] border border-[var(--color-border)]" />
        {:else}
          <div class="w-8 h-8 rounded-[var(--theme-btn-radius,var(--btn-radius,12px))] bg-[var(--theme-primary, var(--color-primary))] text-[var(--theme-btn-primary-text, currentColor)] flex items-center justify-center font-heading font-bold text-xs shadow-xs">
            {brandName.charAt(0) || 'W'}
          </div>
        {/if}
        <span
          style="font-size: var(--theme-text-h3, var(--text-h3-size, 20px)); font-weight: var(--theme-text-h3-weight, var(--text-h3-weight, 700)); color: var(--theme-text-primary, var(--color-text-main));"
          class="font-heading"
        >
          {brandName}
        </span>
      </div>
      <p
        style="font-size: var(--theme-text-body, var(--text-body-size, 14px)); color: var(--theme-text-muted, var(--color-text-muted));"
        class="leading-relaxed max-w-sm"
      >
        {tagline}
      </p>
        </div>
      {/if}

      {#if hasContact}
        <!-- Kolom 2: Kontak Layanan -->
        <div
          style="order: {getSlotOrder('footer_contact')}; margin-top: {styleContact.marginTop}; margin-bottom: {styleContact.marginBottom};"
          class="space-y-2.5 rounded-2xl p-2.5 transition-all cursor-pointer {activeNodeId === 'footer_contact' ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''}"
          on:click={(e) => selectNode(e, 'footer_contact')}
          on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_contact')}
          role="button"
          tabindex="0"
        >
          <h4
            style="font-size: var(--theme-text-caption, var(--text-caption-size, 12px)); font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--theme-text-primary, var(--color-text-main));"
            class="font-heading"
          >
            Kontak & Lokasi
          </h4>
          <ul
            style="font-size: var(--theme-text-body, var(--text-body-size, 14px)); color: {styleContact.color || 'var(--theme-text-muted, var(--color-text-muted))'};"
            class="space-y-2"
          >
            <li class="flex items-center gap-2">
              <MessageCircle size={14} class="text-[var(--theme-primary, var(--color-primary))] shrink-0" />
              <span class="text-[var(--theme-text-muted, var(--color-text-muted))]">WhatsApp:</span>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                class="font-semibold text-[var(--theme-primary, var(--color-primary))] hover:underline"
                on:click|stopPropagation
              >
                {whatsappNumber}
              </a>
            </li>
            <li class="flex items-start gap-2">
              <MapPin size={14} class="text-[var(--theme-primary, var(--color-primary))] mt-0.5 shrink-0" />
              <span class="text-[var(--theme-text-muted, var(--color-text-muted))]">Alamat:</span>
              <span>{address}</span>
            </li>
            <li class="flex items-center gap-2">
              <Clock size={14} class="text-[var(--theme-primary, var(--color-primary))] shrink-0" />
              <span class="text-[var(--theme-text-muted, var(--color-text-muted))]">Jam Buka:</span>
              <span>{storeHours}</span>
            </li>
          </ul>
        </div>
      {/if}

      {#if hasNav}
        <!-- Kolom 3: Navigasi Cepat -->
        <div
          style="order: {getSlotOrder('footer_navigation')}; margin-top: {styleNav.marginTop}; margin-bottom: {styleNav.marginBottom};"
          class="space-y-2.5 rounded-2xl p-2.5 transition-all cursor-pointer {activeNodeId === 'footer_navigation' ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''}"
          on:click={(e) => selectNode(e, 'footer_navigation')}
          on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_navigation')}
          role="button"
          tabindex="0"
        >
          <h4
            style="font-size: var(--theme-text-caption, var(--text-caption-size, 12px)); font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--theme-text-primary, var(--color-text-main));"
            class="font-heading"
          >
            Menu Toko
          </h4>
          <ul
            style="font-size: var(--theme-text-body, var(--text-body-size, 14px)); color: {styleNav.color || 'var(--theme-text-muted, var(--color-text-muted))'};"
            class="space-y-1.5"
          >
            {#each menuLinks as link}
              <li>
                <a href={link.url} class="hover:text-[var(--theme-primary, var(--color-primary))] transition-colors" on:click|stopPropagation>
                  {link.label}
                </a>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  {/if}

  {#if hasCopyright}
    <!-- Bottom Bar -->
    <div
      class="cq-footer-bottom-bar pt-6 rounded-2xl p-2 transition-all cursor-pointer {activeNodeId === 'footer_copyright' ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''}"
      style="order: {copyrightOrder}; margin-top: {styleCopyright.marginTop}; margin-bottom: {styleCopyright.marginBottom}; font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.85); color: {styleCopyright.color || 'var(--theme-text-muted, var(--color-text-muted))'};"
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

<script lang="ts">
  import { MessageCircle, MapPin, Clock } from 'lucide-svelte';
  import type { FooterMenuLink } from '@/types';

  export let brandName: string;
  export let tagline: string;
  export let logoImageUrl: string = '';
  export let address: string;
  export let storeHours: string;
  export let whatsappNumber: string;
  export let whatsappLink: string;
  export let menuLinks: FooterMenuLink[];
  export let copyrightText: string;
  export let activeNodeId: string | null = null;
  export let selectNode: (e: MouseEvent | KeyboardEvent, key: string) => void = () => {};
  export let elementOrder: string[] = ['brand_bio', 'contact_info', 'navigation_links', 'copyright'];

  $: defaultOrder = ['brand_bio', 'contact_info', 'navigation_links', 'copyright'];
  $: effectiveOrder = Array.isArray(elementOrder) && elementOrder.length > 0
    ? [...elementOrder.filter((s) => defaultOrder.includes(s)), ...defaultOrder.filter((s) => !elementOrder.includes(s))]
    : defaultOrder;

  const getSlotOrder = (slot: string) => {
    const idx = effectiveOrder.indexOf(slot);
    return idx === -1 ? 99 : idx;
  };

  $: columnsMinOrder = Math.min(
    getSlotOrder('brand_bio'),
    getSlotOrder('contact_info'),
    getSlotOrder('navigation_links')
  );
  $: copyrightOrder = getSlotOrder('copyright');
</script>

<div class="flex flex-col w-full">
  <div class="cq-footer-grid-3 text-left pb-8 border-b border-[var(--color-border)]" style="order: {columnsMinOrder};">
    <!-- Kolom 1: Profil Toko -->
    <div
      style="order: {getSlotOrder('brand_bio')};"
      class="space-y-3 rounded-2xl p-2.5 transition-all cursor-pointer {activeNodeId === 'footer_brand' ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 dark:ring-offset-slate-900' : ''}"
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
        class="font-sans leading-relaxed max-w-sm"
      >
        {tagline}
      </p>
    </div>

    <!-- Kolom 2: Kontak Layanan -->
    <div
      style="order: {getSlotOrder('contact_info')};"
      class="space-y-2.5 rounded-2xl p-2.5 transition-all cursor-pointer {activeNodeId === 'footer_contact' ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 dark:ring-offset-slate-900' : ''}"
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
        style="font-size: var(--theme-text-body, var(--text-body-size, 14px)); color: var(--theme-text-muted, var(--color-text-muted));"
        class="font-sans space-y-2"
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

    <!-- Kolom 3: Navigasi Cepat -->
    <div
      style="order: {getSlotOrder('navigation_links')};"
      class="space-y-2.5 rounded-2xl p-2.5 transition-all cursor-pointer {activeNodeId === 'footer_navigation' ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 dark:ring-offset-slate-900' : ''}"
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
        style="font-size: var(--theme-text-body, var(--text-body-size, 14px)); color: var(--theme-text-muted, var(--color-text-muted));"
        class="font-sans space-y-1.5"
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
  </div>

  <!-- Bottom Bar -->
  <div
    class="cq-footer-bottom-bar pt-6 rounded-2xl p-2 font-sans transition-all cursor-pointer {activeNodeId === 'footer_copyright' ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 dark:ring-offset-slate-900' : ''}"
    style="order: {copyrightOrder}; font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.85); color: var(--theme-text-muted, var(--color-text-muted));"
    on:click={(e) => selectNode(e, 'footer_copyright')}
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_copyright')}
    role="button"
    tabindex="0"
  >
    <p>{copyrightText}</p>
    <p style="font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.75);">Diberdayakan oleh UMKM Site Builder</p>
  </div>
</div>

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
</script>

<div class="cq-footer-grid-3 text-left pb-8 border-b border-[var(--color-border,rgba(15,23,42,0.08))]">
  <!-- Kolom 1: Profil Toko -->
  <div
    class="space-y-3 rounded-2xl p-2.5 transition-all cursor-pointer {activeNodeId === 'footer_brand' ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''}"
    on:click={(e) => selectNode(e, 'footer_brand')}
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_brand')}
    role="button"
    tabindex="0"
  >
    <div class="flex items-center gap-2.5">
      {#if logoImageUrl}
        <img src={logoImageUrl} alt={brandName} class="w-8 h-8 rounded-[var(--theme-btn-radius,var(--btn-radius,12px))] object-contain bg-[var(--theme-surface,var(--color-card-base,#ffffff))] border border-[var(--color-border,rgba(15,23,42,0.08))]" />
      {:else}
        <div class="w-8 h-8 rounded-[var(--theme-btn-radius,var(--btn-radius,12px))] bg-[var(--theme-primary,#2563eb)] text-[var(--theme-btn-primary-text,#ffffff)] flex items-center justify-center font-[var(--theme-font-heading,var(--font-heading,inherit))] font-bold text-xs shadow-xs">
          {brandName.charAt(0) || 'W'}
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
      class="leading-relaxed max-w-sm"
    >
      {tagline}
    </p>
  </div>

  <!-- Kolom 2: Kontak Layanan -->
  <div
    class="space-y-2.5 rounded-2xl p-2.5 transition-all cursor-pointer {activeNodeId === 'footer_contact' ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''}"
    on:click={(e) => selectNode(e, 'footer_contact')}
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_contact')}
    role="button"
    tabindex="0"
  >
    <h4
      style="font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 12px)); font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--theme-text-primary, var(--color-text-main, #0f172a));"
    >
      Kontak & Lokasi
    </h4>
    <ul
      style="font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: var(--theme-text-body, var(--text-body-size, 14px)); color: var(--theme-text-muted, var(--color-text-secondary, #334155));"
      class="space-y-2"
    >
      <li class="flex items-center gap-2">
        <MessageCircle size={14} class="text-[var(--theme-primary,#2563eb)] shrink-0" />
        <span class="text-[var(--theme-text-muted,var(--color-text-secondary,#64748b))]">WhatsApp:</span>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          class="font-semibold text-[var(--theme-primary,#2563eb)] hover:underline"
          on:click|stopPropagation
        >
          {whatsappNumber}
        </a>
      </li>
      <li class="flex items-start gap-2">
        <MapPin size={14} class="text-[var(--theme-primary,#2563eb)] mt-0.5 shrink-0" />
        <span class="text-[var(--theme-text-muted,var(--color-text-secondary,#64748b))]">Alamat:</span>
        <span>{address}</span>
      </li>
      <li class="flex items-center gap-2">
        <Clock size={14} class="text-[var(--theme-primary,#2563eb)] shrink-0" />
        <span class="text-[var(--theme-text-muted,var(--color-text-secondary,#64748b))]">Jam Buka:</span>
        <span>{storeHours}</span>
      </li>
    </ul>
  </div>

  <!-- Kolom 3: Navigasi Cepat -->
  <div
    class="space-y-2.5 rounded-2xl p-2.5 transition-all cursor-pointer {activeNodeId === 'footer_navigation' ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''}"
    on:click={(e) => selectNode(e, 'footer_navigation')}
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_navigation')}
    role="button"
    tabindex="0"
  >
    <h4
      style="font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 12px)); font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--theme-text-primary, var(--color-text-main, #0f172a));"
    >
      Menu Toko
    </h4>
    <ul
      style="font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: var(--theme-text-body, var(--text-body-size, 14px)); color: var(--theme-text-muted, var(--color-text-secondary, #334155));"
      class="space-y-1.5"
    >
      {#each menuLinks as link}
        <li>
          <a href={link.url} class="hover:text-[var(--theme-primary,#2563eb)] transition-colors" on:click|stopPropagation>
            {link.label}
          </a>
        </li>
      {/each}
    </ul>
  </div>
</div>

<!-- Bottom Bar -->
<div
  class="cq-footer-bottom-bar pt-6 rounded-2xl p-2 transition-all cursor-pointer {activeNodeId === 'footer_copyright' ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''}"
  style="font-family: var(--theme-font-body, var(--font-family, inherit)); font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.85); color: var(--theme-text-muted, var(--color-text-secondary, #64748b));"
  on:click={(e) => selectNode(e, 'footer_copyright')}
  on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectNode(e, 'footer_copyright')}
  role="button"
  tabindex="0"
>
  <p>{copyrightText}</p>
  <p style="font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.75);">Diberdayakan oleh UMKM Site Builder</p>
</div>

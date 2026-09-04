<script lang="ts">
  import { canvasStore, documentStore, activeNodeId } from '../stores/editorStore';
  import type { FooterProps, SectionStyles, FooterSocialLink, FooterMenuLink } from '@/types';
  import './footer/footer.css';
  import {
    DEFAULT_BRAND_NAME,
    DEFAULT_TAGLINE,
    DEFAULT_ADDRESS,
    DEFAULT_STORE_HOURS,
    DEFAULT_WA_NUMBER,
    DEFAULT_SOCIAL_LINKS,
    buildWhatsAppFooterLink,
    buildMiniMapEmbedUrl,
    formatCopyrightText,
    getDynamicLandingNavLinks,
  } from './footer/footer.helpers';
  import {
    FooterMultiColumn,
    FooterCenteredSimple,
    FooterCtaFocused,
    FooterMinimalSingleRow,
    FooterGiantWordmark,
    FooterNewsletterCentric,
    FooterLiveStatusBadge,
    FooterSplitMap,
    FooterSocialLinksGrid,
    FooterBoxedCard,
  } from './footer';

  export let props: FooterProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let layoutPreset: string = 'multi_column';
  export let store: {
    name?: string;
    waNumber?: string;
    googleMapsUrl?: string;
    address?: string;
    storeHours?: string;
    customization?: any;
  } | null = null;

  $: activePreset =
    layoutPreset ||
    (props?.layoutPreset as string) ||
    (styles?.layoutPreset as string) ||
    'multi_column';

  // Otomatis sinkronisasi logo & nama toko dari Header
  $: headerSection = $documentStore?.template?.config?.sections?.find((s) => s.type === 'header_announcement');
  $: headerLogoText = (headerSection?.props?.logoText as string) || '';
  $: headerLogoImageUrl = (headerSection?.props?.logoImageUrl as string) || '';

  // Dual-mode data fallback: Tenant DB vs Header SSOT vs Designer Props
  $: brandName = store?.name || headerLogoText || props?.brandName || props?.logoText || DEFAULT_BRAND_NAME;
  $: logoImageUrl = headerLogoImageUrl || (props?.logoImageUrl as string) || '';
  $: tagline = store?.customization?.tagline || props?.tagline || props?.description || DEFAULT_TAGLINE;
  $: address = store?.customization?.address || store?.address || props?.address || DEFAULT_ADDRESS;
  $: storeHours = store?.customization?.storeHours || store?.storeHours || (props?.storeHours as string) || DEFAULT_STORE_HOURS;
  $: rawWaNumber = store?.waNumber || props?.whatsappNumber || DEFAULT_WA_NUMBER;
  $: whatsappNumber = rawWaNumber;
  $: whatsappLink = buildWhatsAppFooterLink(rawWaNumber, brandName);

  $: googleMapsUrl = store?.googleMapsUrl || props?.googleMapsUrl || '';
  $: mapEmbedUrl = buildMiniMapEmbedUrl(googleMapsUrl || address);

  $: dynamicNavLinks = getDynamicLandingNavLinks($documentStore?.template?.config?.sections);
  $: menuLinks = (Array.isArray(props?.footerLinks) && props.footerLinks.length > 0
    ? props.footerLinks
    : Array.isArray(props?.menuLinks) && props.menuLinks.length > 0
      ? props.menuLinks
      : dynamicNavLinks) as FooterMenuLink[];

  $: socialLinks = (Array.isArray(props?.socialLinks) && props.socialLinks.length > 0
    ? props.socialLinks
    : Array.isArray(store?.customization?.socialLinks) && store?.customization?.socialLinks.length > 0
      ? store.customization.socialLinks
      : DEFAULT_SOCIAL_LINKS) as FooterSocialLink[];

  $: copyrightText = formatCopyrightText(props?.copyrightText, brandName);

  // Preset specific customizable props
  $: floatingCtaTitle = props?.floatingCtaTitle || 'Ingin Pesan Menu Katering Hari Ini?';
  $: floatingCtaSubtitle = props?.floatingCtaSubtitle || 'Dapatkan diskon ongkir untuk pemesanan minimal 10 porsi.';
  $: floatingCtaButtonText = props?.floatingCtaButtonText || 'Chat Sekarang';

  $: newsletterBadge = props?.newsletterBadge || 'Voucher Diskon 15%';
  $: newsletterTitle = props?.newsletterTitle || 'Dapatkan Info Promo Langsung di HP';
  $: newsletterSubtitle = props?.newsletterSubtitle || 'Ketik nomor WhatsApp Anda untuk menerima info diskon dan produk baru.';
  $: newsletterButtonText = props?.newsletterButtonText || 'Daftar Promo';
  $: newsletterPlaceholder = props?.newsletterPlaceholder || 'Masukkan nomor WhatsApp...';

  $: statusBadgeText = props?.statusBadgeText || 'TOKO BUKA';
  $: statusBadgeSubtext = props?.statusBadgeSubtext || 'Siap Menerima Pesanan WhatsApp';
  $: statusChatButtonText = props?.statusChatButtonText || 'Chat Sekarang';

  $: communityTitle = props?.communityTitle || 'Terhubung dengan Kami di Sosial Media';
  $: communitySubtitle = props?.communitySubtitle || 'Ikuti info pembaruan menu harian, voucer promo, dan giveaway menarik.';

  $: boxedOfficialBadge = props?.boxedOfficialBadge || 'Gerai Resmi UMKM';
  $: boxedPrimaryCtaText = props?.boxedPrimaryCtaText || 'Katalog Resmi';
  $: boxedPrimaryCtaLink = props?.boxedPrimaryCtaLink || '#products';
  $: boxedSecondaryCtaText = props?.boxedSecondaryCtaText || 'Konsultasi Pesanan';

  const handleSelectNode = (e: MouseEvent | KeyboardEvent, key: string) => {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, key);
    }
  };
</script>

<footer
  id={sectionId ? `section-${sectionId}` : undefined}
  data-node="footer_container"
  class="footer-card w-full box-border relative transition-all {isActive ? 'relative z-10' : ''} {activePreset === 'boxed_card_footer' || activePreset === 'cta_focused' ? 'py-4' : 'pt-10 pb-6'}"
  style="container-type: inline-size; container-name: footercard;"
>
  <div
    class="builder-safe-container"
    style="max-width: var(--theme-max-width, var(--active-max-width, 1200px)); margin: 0 auto; padding-left: var(--active-safe-zone, var(--theme-safe-zone-desktop, 32px)); padding-right: var(--active-safe-zone, var(--theme-safe-zone-desktop, 32px));"
  >
    {#if activePreset === 'centered_simple'}
      <FooterCenteredSimple
        {brandName}
        {tagline}
        {logoImageUrl}
        {whatsappLink}
        chatButtonText={statusChatButtonText}
        {copyrightText}
        activeNodeId={$activeNodeId}
        selectNode={handleSelectNode}
      />
    {:else if activePreset === 'cta_focused'}
      <FooterCtaFocused
        {brandName}
        {address}
        {floatingCtaTitle}
        {floatingCtaSubtitle}
        {floatingCtaButtonText}
        {whatsappLink}
        {copyrightText}
        activeNodeId={$activeNodeId}
        selectNode={handleSelectNode}
      />
    {:else if activePreset === 'minimal_single_row'}
      <FooterMinimalSingleRow
        {brandName}
        {logoImageUrl}
        {copyrightText}
        {socialLinks}
        activeNodeId={$activeNodeId}
        selectNode={handleSelectNode}
      />
    {:else if activePreset === 'giant_wordmark'}
      <FooterGiantWordmark
        {brandName}
        {tagline}
        {whatsappNumber}
        {whatsappLink}
        {copyrightText}
        activeNodeId={$activeNodeId}
        selectNode={handleSelectNode}
      />
    {:else if activePreset === 'newsletter_centric'}
      <FooterNewsletterCentric
        {newsletterBadge}
        {newsletterTitle}
        {newsletterSubtitle}
        {newsletterButtonText}
        {newsletterPlaceholder}
        {copyrightText}
        activeNodeId={$activeNodeId}
        selectNode={handleSelectNode}
      />
    {:else if activePreset === 'live_status_badge'}
      <FooterLiveStatusBadge
        {statusBadgeText}
        {statusBadgeSubtext}
        {statusChatButtonText}
        {whatsappLink}
        {copyrightText}
        {storeHours}
        activeNodeId={$activeNodeId}
        selectNode={handleSelectNode}
      />
    {:else if activePreset === 'split_map_footer'}
      <FooterSplitMap
        {brandName}
        {tagline}
        {address}
        {whatsappNumber}
        {whatsappLink}
        {mapEmbedUrl}
        {copyrightText}
        activeNodeId={$activeNodeId}
        selectNode={handleSelectNode}
      />
    {:else if activePreset === 'social_links_grid'}
      <FooterSocialLinksGrid
        {communityTitle}
        {communitySubtitle}
        {socialLinks}
        {whatsappLink}
        {copyrightText}
        activeNodeId={$activeNodeId}
        selectNode={handleSelectNode}
      />
    {:else if activePreset === 'boxed_card_footer'}
      <FooterBoxedCard
        {boxedOfficialBadge}
        {brandName}
        {tagline}
        {boxedPrimaryCtaText}
        {boxedPrimaryCtaLink}
        {boxedSecondaryCtaText}
        {whatsappLink}
        {copyrightText}
        activeNodeId={$activeNodeId}
        selectNode={handleSelectNode}
      />
    {:else}
      <!-- Preset 1: multi_column (Default) -->
      <FooterMultiColumn
        {brandName}
        {tagline}
        {logoImageUrl}
        {address}
        {storeHours}
        {whatsappNumber}
        {whatsappLink}
        {menuLinks}
        {copyrightText}
        activeNodeId={$activeNodeId}
        selectNode={handleSelectNode}
      />
    {/if}
  </div>
</footer>

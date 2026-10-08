<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import HeroImageUploadContent from '../../content/hero/HeroImageUploadContent.svelte';
  import HeroCtaLinkSelect from '../../content/hero/HeroCtaLinkSelect.svelte';
  import SearchableIconDropdown from '../SearchableIconDropdown.svelte';
  import { stripEmoji, HERO_BADGE_ICON_OPTIONS } from '../../sections/hero/heroIcons';
  import {
    supportsHeroImage,
    supportsHeroCta,
    supportsHeroBadge,
  } from '../../sections/hero/heroLayout.helpers';
  import HeroTrustBadgesContent from '../../content/hero/HeroTrustBadgesContent.svelte';
  import HeroTerminalContent from '../../content/hero/HeroTerminalContent.svelte';
  import HeroFloatingCardsContent from '../../content/hero/HeroFloatingCardsContent.svelte';
  import HeroSocialProofContent from '../../content/hero/HeroSocialProofContent.svelte';
  import HeroDualProductContent from '../../content/hero/HeroDualProductContent.svelte';
  import HeroBentoContent from '../../content/hero/HeroBentoContent.svelte';
  import HeroChatContent from '../../content/hero/HeroChatContent.svelte';
  import HeroCustomCardContent from '../../content/hero/HeroCustomCardContent.svelte';

  export let section: TemplateSection;
  export let nodeId: string;
  export let onPropChange: (key: string, value: unknown) => void = () => {};

  $: activePreset =
    (section.props?.layoutPreset as string) ||
    (section.styles?.layoutPreset as string) ||
    section.layoutPreset ||
    'split_left_text';

  $: badgeText = (section.props?.badgeText as string) ?? '';
  $: badgeIcon = (section.props?.badgeIcon as string) ?? '';
  $: title = (section.props?.title as string) ?? '';
  $: titleTag = (section.props?.titleTag as string) || 'h1';
  $: subtitle = (section.props?.subtitle as string) ?? '';
  $: ctaText = (section.props?.ctaText as string) ?? '';
  $: ctaLink = (section.props?.ctaLink as string) ?? '#';
  $: secondaryCtaText = (section.props?.secondaryCtaText as string) ?? '';
  $: secondaryCtaLink = (section.props?.secondaryCtaLink as string) ?? '#';
  $: imageUrl = (section.props?.imageUrl as string) ?? '';

  $: supportsImage = supportsHeroImage(activePreset);
  $: supportsCta = supportsHeroCta(activePreset);
  $: supportsBadge = supportsHeroBadge(activePreset);

  $: isBadge = nodeId === 'badge' || nodeId === 'hero_badge';
  $: isTitle = nodeId === 'title' || nodeId === 'hero_title';
  $: isSubtitle = nodeId === 'subtitle' || nodeId === 'hero_subtitle';
  $: isPrimaryCta = nodeId === 'cta' || nodeId === 'hero_cta' || nodeId === 'hero_cta_primary';
  $: isSecondaryCta = nodeId === 'secondary_cta' || nodeId === 'hero_cta_secondary';
  $: isImage = nodeId === 'image' || nodeId === 'hero_image' || nodeId === 'hero_media' || nodeId === 'hero_founder_photo';
</script>

<div class="space-y-4 text-left">
  {#if isBadge}
    {#if supportsBadge}
      <div class="space-y-3">
        <div class="space-y-1">
          <label class="block font-semibold text-xs text-base-content/80" for="hero-node-badge-text">
            Teks Lencana Promo (Badge)
          </label>
          <input
            id="hero-node-badge-text"
            type="text"
            value={stripEmoji(badgeText)}
            on:input={(e) => onPropChange('badgeText', stripEmoji(e.currentTarget.value))}
            class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs focus:outline-none focus:border-primary font-medium"
            placeholder="Promo Spesial UMKM"
          />
        </div>
        <SearchableIconDropdown
          label="Ikon Lencana Promo (Badge)"
          selectedIcon={badgeIcon}
          options={HERO_BADGE_ICON_OPTIONS}
          onSelect={(val) => onPropChange('badgeIcon', val)}
        />
      </div>
    {:else}
      <p class="text-xs text-base-content/60 italic p-3 bg-base-200/40 rounded-xl">
        Preset tata letak ini tidak mendukung elemen lencana promo.
      </p>
    {/if}
  {:else if isTitle}
    <div class="space-y-3">
      <div class="space-y-1">
        <label class="block font-semibold text-xs text-base-content/80" for="hero-node-title-input">
          Judul Utama Hero
        </label>
        <textarea
          id="hero-node-title-input"
          value={stripEmoji(title)}
          on:input={(e) => onPropChange('title', stripEmoji(e.currentTarget.value))}
          rows="2"
          class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs focus:outline-none focus:border-primary font-bold resize-y"
          placeholder="Produk Terbaik untuk Kebutuhan Anda"
        ></textarea>
      </div>
      <div class="space-y-1">
        <label class="block font-semibold text-xs text-base-content/80" for="hero-node-title-tag">
          Tag Heading Semantik (SEO)
        </label>
        <select
          id="hero-node-title-tag"
          value={titleTag}
          on:change={(e) => onPropChange('titleTag', e.currentTarget.value)}
          class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs focus:outline-none focus:border-primary"
        >
          <option value="h1">Heading 1 (&lt;h1&gt;) — Utama Halaman</option>
          <option value="h2">Heading 2 (&lt;h2&gt;) — Seksi</option>
        </select>
      </div>
    </div>
  {:else if isSubtitle}
    <div class="space-y-1">
      <label class="block font-semibold text-xs text-base-content/80" for="hero-node-sub-input">
        Subjudul & Penjelasan
      </label>
      <textarea
        id="hero-node-sub-input"
        value={stripEmoji(subtitle)}
        on:input={(e) => onPropChange('subtitle', stripEmoji(e.currentTarget.value))}
        rows="3"
        class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs focus:outline-none focus:border-primary resize-y"
        placeholder="Deskripsi singkat mengenai penawaran dan produk unggulan toko Anda."
      ></textarea>
    </div>
  {:else if isPrimaryCta}
    {#if supportsCta}
      <div class="space-y-3">
        <div class="space-y-1">
          <label class="block font-semibold text-xs text-base-content/80" for="hero-node-cta-text">
            Teks Tombol Aksi Utama (CTA)
          </label>
          <input
            id="hero-node-cta-text"
            type="text"
            value={stripEmoji(ctaText)}
            on:input={(e) => onPropChange('ctaText', stripEmoji(e.currentTarget.value))}
            class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs focus:outline-none focus:border-primary font-bold"
            placeholder="Pesan Sekarang"
          />
        </div>
        <HeroCtaLinkSelect
          value={ctaLink || '#produk'}
          onChange={(val) => onPropChange('ctaLink', val)}
        />
      </div>
    {:else}
      <p class="text-xs text-base-content/60 italic p-3 bg-base-200/40 rounded-xl">
        Preset tata letak ini tidak menampilkan tombol aksi utama.
      </p>
    {/if}
  {:else if isSecondaryCta}
    <div class="space-y-3">
      <div class="space-y-1">
        <label class="block font-semibold text-xs text-base-content/80" for="hero-node-sec-cta-text">
          Teks Tombol Sekunder
        </label>
        <input
          id="hero-node-sec-cta-text"
          type="text"
          value={stripEmoji(secondaryCtaText)}
          on:input={(e) => onPropChange('secondaryCtaText', stripEmoji(e.currentTarget.value))}
          class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs focus:outline-none focus:border-primary"
          placeholder="Pelajari Lebih Lanjut"
        />
      </div>
      <HeroCtaLinkSelect
        value={secondaryCtaLink || '#tentang'}
        onChange={(val) => onPropChange('secondaryCtaLink', val)}
      />
    </div>
  {:else if isImage}
    {#if supportsImage}
      <HeroImageUploadContent {imageUrl} {onPropChange} />
    {:else}
      <p class="text-xs text-base-content/60 italic p-3 bg-base-200/40 rounded-xl">
        Preset tata letak ini tidak menggunakan ilustrasi gambar terpisah.
      </p>
    {/if}
  {:else if nodeId === 'trust_badges' || activePreset === 'gradient_mesh_glow' || activePreset === 'badge_ticker_split'}
    <HeroTrustBadgesContent
      trustBadges={section.props?.trustBadges as Array<{ text: string; icon?: string }> || []}
      {onPropChange}
    />
  {:else if nodeId === 'terminal' || activePreset === 'interactive_terminal_code'}
    <HeroTerminalContent
      terminalFile={(section.props?.terminalFile as string) || 'store-system.sh'}
      terminalCmd1={(section.props?.terminalCmd1 as string) || '$ check --stock ready'}
      terminalRes1={(section.props?.terminalRes1 as string) || 'Seluruh produk terverifikasi & siap kirim'}
      terminalCmd2={(section.props?.terminalCmd2 as string) || '$ order --instant-whatsapp'}
      terminalRes2={(section.props?.terminalRes2 as string) || 'Integrasi otomatis pesan WA tanpa ribet'}
      terminalStatus={(section.props?.terminalStatus as string) || '_ Siap melayani pelanggan...'}
      {onPropChange}
    />
  {:else if nodeId === 'floating_cards' || activePreset === 'floating_cards_showcase'}
    <HeroFloatingCardsContent
      floatingCards={section.props?.floatingCards as Array<{ icon: string; title: string; desc: string }> || []}
      {onPropChange}
    />
  {:else if nodeId === 'social_proof' || activePreset === 'social_proof_community'}
    <HeroSocialProofContent
      socialProofStars={typeof section.props?.socialProofStars === 'number' ? section.props.socialProofStars : 5}
      socialProofAvatars={(section.props?.socialProofAvatars as string[]) || []}
      socialProofText={(section.props?.socialProofText as string) || 'Dipercaya oleh 2.500+ Pembeli'}
      {onPropChange}
    />
  {:else if nodeId === 'dual_product' || activePreset === 'dual_product_showcase'}
    <HeroDualProductContent
      selectedProductIndex1={typeof section.props?.selectedProductIndex1 === 'number' ? section.props.selectedProductIndex1 : -1}
      selectedProductIndex2={typeof section.props?.selectedProductIndex2 === 'number' ? section.props.selectedProductIndex2 : -1}
      {onPropChange}
    />
  {:else if nodeId === 'bento_hero' || activePreset === 'bento_masonry_hero'}
    <HeroBentoContent
      bentoPromoTitle={(section.props?.bentoPromoTitle as string) || 'Diskon Pembeli Pertama'}
      bentoPromoHighlight={(section.props?.bentoPromoHighlight as string) || 'Potongan 25%'}
      bentoPromoSubtitle={(section.props?.bentoPromoSubtitle as string) || 'Klaim voucher di WhatsApp sekarang'}
      bentoPromoTextColor={(section.props?.bentoPromoTextColor as string) || 'auto'}
      bentoReviewStars={typeof section.props?.bentoReviewStars === 'number' ? section.props.bentoReviewStars : 5}
      bentoReviewText={(section.props?.bentoReviewText as string) || '"Bahan sangat halus dan adem, motifnya khas dan tidak pasaran."'}
      bentoReviewAuthor={(section.props?.bentoReviewAuthor as string) || '- Pelanggan Terverifikasi'}
      bentoFeatureIcon={(section.props?.bentoFeatureIcon as string) || 'Truck'}
      bentoFeatureTitle={(section.props?.bentoFeatureTitle as string) || 'Kirim Seluruh Indonesia'}
      bentoFeatureSubtitle={(section.props?.bentoFeatureSubtitle as string) || 'Packing aman bubble wrap tebal'}
      {onPropChange}
    />
  {:else if nodeId === 'chat_bubble' || activePreset === 'sticky_whatsapp_pill_float'}
    <HeroChatContent
      chatMessages={(section.props?.chatMessages as import('../../content/hero/heroContent.types').ChatItem[]) || []}
      {onPropChange}
    />
  {:else if ['sticker_badge_playful', 'dual_contrast_split', 'brand_story_founder', 'split_stat_counter'].includes(activePreset)}
    <HeroCustomCardContent
      preset={activePreset}
      stickerText={(section.props?.stickerText as string) || 'PROMO TERBATAS!'}
      badgeBgColor={(section.props?.badgeBgColor as string) || ''}
      cardBgColor={(section.props?.cardBgColor as string) || ''}
      contrastCardBg={(section.props?.contrastCardBg as string) || 'slate-950'}
      contrastBadgeText={(section.props?.contrastBadgeText as string) || 'Pendaftaran Terbatas'}
      contrastTitleText={(section.props?.contrastTitleText as string) || 'Kuota Tersisa 4 Peserta'}
      contrastDescText={(section.props?.contrastDescText as string) || 'Mendapatkan modul lengkap, sertifikat kelulusan, dan sesi praktik langsung bersama mentor berpengalaman.'}
      founderRole={(section.props?.founderRole as string) || 'Pendiri & Artisan'}
      founderTitle={(section.props?.founderTitle as string) || 'Pengrajin Resep Asli'}
      stats={(section.props?.stats as Array<{ value: string; label: string }>) || []}
      {onPropChange}
    />
  {:else}
    <p class="text-xs text-base-content/60 italic p-3 bg-base-200/40 rounded-xl">
      Pilih elemen hero pada kanvas untuk mengedit teks atau kontennya.
    </p>
  {/if}
</div>

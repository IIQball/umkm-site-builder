<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import { Button } from '@/components/ui';
  import { makeHandlePropChange } from './content.helpers';
  import HeroImageUploadContent from './hero/HeroImageUploadContent.svelte';
  import HeroVideoUploadContent from './hero/HeroVideoUploadContent.svelte';
  import HeroCtaLinkSelect from './hero/HeroCtaLinkSelect.svelte';
  import SearchableIconDropdown from '../inspector/SearchableIconDropdown.svelte';
  import {
    stripEmoji,
    HERO_BADGE_ICON_OPTIONS,
  } from '../sections/hero/heroIcons';
  import {
    supportsHeroImage,
    supportsHeroCta,
    supportsHeroBadge,
    getEffectiveHeroElementOrder,
  } from '../sections/hero/heroLayout.helpers';

  import HeroTrustBadgesContent from './hero/HeroTrustBadgesContent.svelte';
  import HeroTerminalContent from './hero/HeroTerminalContent.svelte';
  import HeroFloatingCardsContent from './hero/HeroFloatingCardsContent.svelte';
  import HeroSocialProofContent from './hero/HeroSocialProofContent.svelte';
  import HeroDualProductContent from './hero/HeroDualProductContent.svelte';
  import HeroBentoContent from './hero/HeroBentoContent.svelte';
  import HeroChatContent from './hero/HeroChatContent.svelte';
  import HeroCustomCardContent from './hero/HeroCustomCardContent.svelte';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: handlePropChange = makeHandlePropChange(section, onUpdate);
  $: preset =
    (section.props?.layoutPreset as string) ||
    (section.styles?.layoutPreset as string) ||
    section.layoutPreset ||
    'split_left_text';

  $: elementOrder = getEffectiveHeroElementOrder(
    preset,
    section.props?.elementOrder,
    section.props?.heroPreset as string
  );

  $: supportsImage = supportsHeroImage(preset) && elementOrder.includes('image');
  $: supportsCta = supportsHeroCta(preset) && elementOrder.includes('cta');
  $: supportsBadge = supportsHeroBadge(preset) && elementOrder.includes('badge');

  $: subtitle = (section.props?.subtitle as string) ?? '';
  $: imageUrl = (section.props?.imageUrl as string) ?? '';
  $: badgeIcon = (section.props?.badgeIcon as string) ?? '';
</script>

<div class="space-y-4">
  <!-- Lencana Promo & Kategori - Hanya jika didukung layout -->
  {#if supportsBadge}
    <div class="space-y-2">
      <div>
        <label for="hero-badge" class="block font-semibold text-xs text-base-content/80 mb-1">
          Lencana Promo & Kategori
        </label>
        <input
          id="hero-badge"
          type="text"
          value={stripEmoji(section.props?.badgeText ?? '')}
          on:input={(e) => handlePropChange('badgeText', stripEmoji(e.currentTarget.value))}
          class="input input-bordered input-sm w-full"
          placeholder="Promo Spesial UMKM"
        />
      </div>
      <SearchableIconDropdown
        label="Ikon Lencana Promo (Badge)"
        selectedIcon={badgeIcon}
        options={HERO_BADGE_ICON_OPTIONS}
        onSelect={(val) => handlePropChange('badgeIcon', val)}
      />
    </div>
  {/if}

  <!-- Judul Utama (H1) -->
  {#if elementOrder.includes('title')}
    <div>
      <label for="hero-title" class="block font-semibold text-xs text-base-content/80 mb-1">
        Judul Utama (H1)
      </label>
      <input
        id="hero-title"
        type="text"
        value={stripEmoji(section.props?.title ?? '')}
        on:input={(e) => handlePropChange('title', stripEmoji(e.currentTarget.value))}
        class="input input-bordered input-sm w-full"
        placeholder="Selamat datang di toko kami"
      />
    </div>
  {/if}

  <!-- Subjudul & Deskripsi -->
  {#if elementOrder.includes('subtitle')}
    <div>
      <label for="hero-subtitle" class="block font-semibold text-xs text-base-content/80 mb-1">
        Subjudul & Deskripsi
      </label>
      <textarea
        id="hero-subtitle"
        value={stripEmoji(subtitle)}
        on:input={(e) => handlePropChange('subtitle', stripEmoji(e.currentTarget.value))}
        rows="2"
        class="textarea textarea-bordered textarea-sm w-full resize-y"
        placeholder="Produk berkualitas dengan harga terjangkau dan pelayanan terpercaya."
      ></textarea>
    </div>
  {/if}

  <!-- Panel Upload Gambar Spanduk / Background - Hanya jika didukung layout -->
  {#if supportsImage}
    <div class="space-y-3">
      <HeroImageUploadContent
        {imageUrl}
        onPropChange={handlePropChange}
      />
    </div>
  {/if}

  <!-- Panel Upload Video Background - Jika layout preset video_background_loop -->
  {#if preset === 'video_background_loop'}
    <div class="space-y-3">
      <HeroVideoUploadContent
        videoUrl={(section.props?.videoUrl as string) ?? ''}
        onPropChange={handlePropChange}
      />
    </div>
  {/if}

  <!-- Tombol Aksi (CTA) - Hanya jika didukung layout -->
  {#if supportsCta}
    <div class="space-y-2.5 pt-1">
      <div>
        <label for="cta-text" class="block font-semibold text-xs text-base-content/80 mb-1">
          Teks Tombol Aksi (CTA)
        </label>
        <input
          id="cta-text"
          type="text"
          value={stripEmoji(section.props?.ctaText ?? '')}
          on:input={(e) => handlePropChange('ctaText', stripEmoji(e.currentTarget.value))}
          class="input input-bordered input-sm w-full"
          placeholder="Lihat Katalog"
        />
      </div>
      <div>
        <HeroCtaLinkSelect
          value={(section.props?.ctaLink as string) || '#produk'}
          onChange={(val) => handlePropChange('ctaLink', val)}
        />
      </div>
    </div>
  {/if}

  <!-- Pengaturan Konten Spesifik Layout Hero -->
  {#if preset === 'gradient_mesh_glow' || preset === 'badge_ticker_split'}
    <HeroTrustBadgesContent
      trustBadges={section.props?.trustBadges as Array<{ text: string; icon?: string }> || []}
      onPropChange={handlePropChange}
    />
  {:else if preset === 'interactive_terminal_code'}
    <HeroTerminalContent
      terminalFile={(section.props?.terminalFile as string) || 'store-system.sh'}
      terminalCmd1={(section.props?.terminalCmd1 as string) || '$ check --stock ready'}
      terminalRes1={(section.props?.terminalRes1 as string) || 'Seluruh produk terverifikasi & siap kirim'}
      terminalCmd2={(section.props?.terminalCmd2 as string) || '$ order --instant-whatsapp'}
      terminalRes2={(section.props?.terminalRes2 as string) || 'Integrasi otomatis pesan WA tanpa ribet'}
      terminalStatus={(section.props?.terminalStatus as string) || '_ Siap melayani pelanggan...'}
      onPropChange={handlePropChange}
    />
  {:else if preset === 'floating_cards_showcase'}
    <HeroFloatingCardsContent
      floatingCards={section.props?.floatingCards as Array<{ icon: string; title: string; desc: string }> || []}
      onPropChange={handlePropChange}
    />
  {:else if preset === 'social_proof_community'}
    <HeroSocialProofContent
      socialProofStars={typeof section.props?.socialProofStars === 'number' ? section.props.socialProofStars : 5}
      socialProofAvatars={(section.props?.socialProofAvatars as string[]) || []}
      socialProofText={(section.props?.socialProofText as string) || 'Dipercaya oleh 2.500+ Pembeli'}
      onPropChange={handlePropChange}
    />
  {:else if preset === 'dual_product_showcase'}
    <HeroDualProductContent
      selectedProductIndex1={typeof section.props?.selectedProductIndex1 === 'number' ? section.props.selectedProductIndex1 : -1}
      selectedProductIndex2={typeof section.props?.selectedProductIndex2 === 'number' ? section.props.selectedProductIndex2 : -1}
      onPropChange={handlePropChange}
    />
  {:else if preset === 'bento_masonry_hero'}
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
      onPropChange={handlePropChange}
    />
  {:else if preset === 'sticky_whatsapp_pill_float'}
    <HeroChatContent
      chatMessages={(section.props?.chatMessages as import('./hero/heroContent.types').ChatItem[]) || []}
      onPropChange={handlePropChange}
    />
  {:else if ['sticker_badge_playful', 'dual_contrast_split', 'brand_story_founder', 'split_stat_counter'].includes(preset)}
    <HeroCustomCardContent
      {preset}
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
      onPropChange={handlePropChange}
    />
  {/if}

  <!-- Pengaturan Tinggi Section Canvas (8pt Grid) -->
  <div class="pt-3 border-t border-base-300">
    <span class="block font-semibold text-xs text-base-content/80 mb-1">
      Tinggi Minimum Spanduk (Grid 8pt)
    </span>
    <div class="grid grid-cols-4 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 text-xs">
      {#each [
        { label: '480px', value: '480px' },
        { label: '560px', value: '560px' },
        { label: '640px', value: '640px' },
        { label: 'Otomatis', value: 'auto' },
      ] as h}
        <Button
          type="button"
          size="xs"
          variant={(section.styles?.minHeight || 'auto') === h.value ? 'primary' : 'ghost'}
          on:click={() =>
            onUpdate({
              ...section,
              styles: {
                ...(section.styles || {}),
                minHeight: h.value,
              },
            })}
          class={`!py-1.5 !h-auto !min-h-0 rounded font-medium text-center ${
            (section.styles?.minHeight || 'auto') === h.value
              ? 'shadow-sm font-bold'
              : 'text-base-content/60'
          }`}
        >
          {h.label}
        </Button>
      {/each}
    </div>
    <span class="block text-[10.5px] text-base-content/50 mt-1">
      Semua elemen tetap terpusat di tengah secara vertikal saat tinggi ditambah.
    </span>
  </div>
</div>
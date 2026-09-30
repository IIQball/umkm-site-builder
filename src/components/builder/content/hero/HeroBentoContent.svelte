<script lang="ts">
  import { Star } from 'lucide-svelte';
  import SearchableIconDropdown from '../../inspector/SearchableIconDropdown.svelte';
  import { HERO_BADGE_ICON_OPTIONS } from '../../sections/hero/heroIcons';

  export let bentoPromoTitle: string = 'Diskon Pembeli Pertama';
  export let bentoPromoHighlight: string = 'Potongan 25%';
  export let bentoPromoSubtitle: string = 'Klaim voucher di WhatsApp sekarang';
  export let bentoPromoTextColor: string = 'auto';
  export let bentoReviewStars: number = 5;
  export let bentoReviewText: string = '"Bahan sangat halus dan adem, motifnya khas dan tidak pasaran."';
  export let bentoReviewAuthor: string = '- Pelanggan Terverifikasi';
  export let bentoFeatureIcon: string = 'Truck';
  export let bentoFeatureTitle: string = 'Kirim Seluruh Indonesia';
  export let bentoFeatureSubtitle: string = 'Packing aman bubble wrap tebal';
  export let onPropChange: (key: string, value: unknown) => void;

  $: currentStars = typeof bentoReviewStars === 'number' ? bentoReviewStars : 5;
</script>

<div class="space-y-4 pt-3 border-t border-base-300">
  <span class="block font-semibold text-xs text-base-content/80">
    Kustomisasi Ubin Bento Grid
  </span>

  <!-- Ubin 1: Kartu Promo Diskon -->
  <div class="p-3 rounded-xl bg-base-200/50 border border-base-300 space-y-2">
    <span class="text-[11px] font-bold text-base-content/80 block">Kartu Diskon Promo</span>

    <div>
      <label for="bento-promo-tag" class="block text-[11px] font-medium text-base-content/70 mb-0.5">
        Label Tagline Promo
      </label>
      <input
        id="bento-promo-tag"
        type="text"
        value={bentoPromoTitle}
        on:input={(e) => onPropChange('bentoPromoTitle', e.currentTarget.value)}
        class="input input-bordered input-xs w-full"
        placeholder="Diskon Pembeli Pertama"
      />
    </div>

    <div>
      <label for="bento-promo-hl" class="block text-[11px] font-medium text-base-content/70 mb-0.5">
        Nominal / Besaran Diskon
      </label>
      <input
        id="bento-promo-hl"
        type="text"
        value={bentoPromoHighlight}
        on:input={(e) => onPropChange('bentoPromoHighlight', e.currentTarget.value)}
        class="input input-bordered input-xs w-full font-bold"
        placeholder="Potongan 25%"
      />
    </div>

    <div>
      <label for="bento-promo-sub" class="block text-[11px] font-medium text-base-content/70 mb-0.5">
        Subjudul / Instruksi
      </label>
      <input
        id="bento-promo-sub"
        type="text"
        value={bentoPromoSubtitle}
        on:input={(e) => onPropChange('bentoPromoSubtitle', e.currentTarget.value)}
        class="input input-bordered input-xs w-full"
        placeholder="Klaim voucher di WhatsApp sekarang"
      />
    </div>

    <div>
      <label for="bento-text-color" class="block text-[11px] font-medium text-base-content/70 mb-0.5">
        Warna Teks Promo
      </label>
      <select
        id="bento-text-color"
        value={bentoPromoTextColor || 'auto'}
        on:change={(e) => onPropChange('bentoPromoTextColor', e.currentTarget.value)}
        class="select select-bordered select-xs w-full"
      >
        <option value="auto">Otomatis (Kontras Tema)</option>
        <option value="#ffffff">Putih Bersih (#FFFFFF)</option>
        <option value="#0f172a">Gelap Pekat (#0F172A)</option>
        <option value="#fef08a">Kuning Terang (#FEF08A)</option>
      </select>
    </div>
  </div>

  <!-- Ubin 2: Kartu Ulasan / Review -->
  <div class="p-3 rounded-xl bg-base-200/50 border border-base-300 space-y-2">
    <span class="text-[11px] font-bold text-base-content/80 block">Kartu Ulasan Pelanggan</span>

    <div>
      <span class="block text-[11px] font-medium text-base-content/70 mb-1">
        Bintang Ulasan: {currentStars} / 5
      </span>
      <div class="flex items-center gap-2">
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={currentStars}
          on:input={(e) => onPropChange('bentoReviewStars', parseInt(e.currentTarget.value, 10))}
          class="range range-xs range-warning flex-1"
        />
        <div class="flex items-center gap-0.5 text-amber-400">
          {#each Array(currentStars) as _}
            <Star size={12} class="fill-current text-amber-400" />
          {/each}
        </div>
      </div>
    </div>

    <div>
      <label for="bento-review-text" class="block text-[11px] font-medium text-base-content/70 mb-0.5">
        Isi Testimoni
      </label>
      <textarea
        id="bento-review-text"
        rows="2"
        value={bentoReviewText}
        on:input={(e) => onPropChange('bentoReviewText', e.currentTarget.value)}
        class="textarea textarea-bordered textarea-xs w-full"
        placeholder="Isi testimoni pembeli"
      ></textarea>
    </div>

    <div>
      <label for="bento-review-author" class="block text-[11px] font-medium text-base-content/70 mb-0.5">
        Nama / Status Reviewer
      </label>
      <input
        id="bento-review-author"
        type="text"
        value={bentoReviewAuthor}
        on:input={(e) => onPropChange('bentoReviewAuthor', e.currentTarget.value)}
        class="input input-bordered input-xs w-full"
        placeholder="- Pelanggan Terverifikasi"
      />
    </div>
  </div>

  <!-- Ubin 3: Kartu Pengiriman / Fitur Cepat -->
  <div class="p-3 rounded-xl bg-base-200/50 border border-base-300 space-y-2">
    <span class="text-[11px] font-bold text-base-content/80 block">Kartu Layanan Pengiriman</span>

    <SearchableIconDropdown
      label="Ikon Layanan"
      selectedIcon={bentoFeatureIcon || 'Truck'}
      options={HERO_BADGE_ICON_OPTIONS}
      onSelect={(val) => onPropChange('bentoFeatureIcon', val)}
    />

    <div>
      <label for="bento-feat-title" class="block text-[11px] font-medium text-base-content/70 mb-0.5">
        Judul Layanan
      </label>
      <input
        id="bento-feat-title"
        type="text"
        value={bentoFeatureTitle}
        on:input={(e) => onPropChange('bentoFeatureTitle', e.currentTarget.value)}
        class="input input-bordered input-xs w-full font-semibold"
        placeholder="Kirim Seluruh Indonesia"
      />
    </div>

    <div>
      <label for="bento-feat-sub" class="block text-[11px] font-medium text-base-content/70 mb-0.5">
        Deskripsi Pengiriman
      </label>
      <input
        id="bento-feat-sub"
        type="text"
        value={bentoFeatureSubtitle}
        on:input={(e) => onPropChange('bentoFeatureSubtitle', e.currentTarget.value)}
        class="input input-bordered input-xs w-full"
        placeholder="Packing aman bubble wrap tebal"
      />
    </div>
  </div>
</div>

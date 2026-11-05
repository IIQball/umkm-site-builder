<script lang="ts">
  import { Megaphone, Clock, MapPin, Zap, Bike, ShieldCheck } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import SearchableIconDropdown from '../../inspector/SearchableIconDropdown.svelte';
  import {
    DELIVERY_ICON_OPTIONS,
    BADGE_BPOM_ICON_OPTIONS,
    BADGE_HALAL_ICON_OPTIONS,
    PROMO_ICON_OPTIONS,
    stripEmoji,
  } from '../../sections/header/headerIcons';

  export let section: TemplateSection;
  export let handlePropChange: (key: string, value: any) => void;
  export let topBarType: string;
  export let isStoreBadge: boolean;
  export let showAnnouncement: boolean;
</script>

{#if topBarType === 'contact'}
  <div class="space-y-3 p-3 bg-base-200/40 rounded-xl border border-base-200">
    <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content">
      <Clock size={14} class="text-emerald-500" />
      <span>Informasi Kontak & Jam Operasional</span>
    </div>
    <div>
      <label for="store-hours" class="block font-medium text-[11px] text-base-content/70 mb-1">Jam Operasional Toko</label>
      <input
        id="store-hours"
        type="text"
        value={section.props?.storeHours ?? 'Buka: 08.00 - 21.00 WIB'}
        on:input={(e) => handlePropChange('storeHours', e.currentTarget.value)}
        class="input input-bordered input-xs w-full"
        placeholder="Buka: 08.00 - 21.00 WIB"
      />
    </div>
    <div>
      <label for="store-address" class="flex items-center gap-1 font-medium text-[11px] text-base-content/70 mb-1">
        <MapPin size={11} class="text-[var(--color-primary)]" />
        <span>Alamat Singkat Toko</span>
      </label>
      <input
        id="store-address"
        type="text"
        value={section.props?.address ?? 'Jakarta, Indonesia'}
        on:input={(e) => handlePropChange('address', e.currentTarget.value)}
        class="input input-bordered input-xs w-full"
        placeholder="Jakarta, Indonesia"
      />
    </div>
    <div>
      <label for="store-status" class="block font-medium text-[11px] text-base-content/70 mb-1">Status Operasional Toko</label>
      <input
        id="store-status"
        type="text"
        value={section.props?.storeStatus ?? 'Toko Buka'}
        on:input={(e) => handlePropChange('storeStatus', e.currentTarget.value)}
        class="input input-bordered input-xs w-full"
        placeholder="Toko Buka"
      />
    </div>
  </div>

{:else if topBarType === 'countdown'}
  <div class="space-y-3 p-3 bg-rose-500/10 rounded-xl border border-rose-500/30">
    <div class="flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300">
      <Zap size={14} class="fill-current text-rose-500" />
      <span>Pengaturan Hitung Mundur Promo Flash Sale</span>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div>
        <label for="promo-title" class="block font-medium text-[11px] text-base-content/70 mb-1">Judul Promo</label>
        <input
          id="promo-title"
          type="text"
          value={stripEmoji(section.props?.promoTitle ?? 'FLASH SALE')}
          on:input={(e) => handlePropChange('promoTitle', stripEmoji(e.currentTarget.value))}
          class="input input-bordered input-xs w-full"
          placeholder="FLASH SALE"
        />
      </div>
      <div>
        <label for="promo-duration" class="block font-medium text-[11px] text-base-content/70 mb-1">Durasi (Jam)</label>
        <input
          id="promo-duration"
          type="number"
          min="1"
          max="72"
          value={section.props?.promoDurationHours ?? 4}
          on:input={(e) => handlePropChange('promoDurationHours', Number(e.currentTarget.value) || 4)}
          class="input input-bordered input-xs w-full"
          placeholder="4"
        />
      </div>
    </div>
    <SearchableIconDropdown
      label="Ikon Promo Flash Sale"
      selectedIcon={String(section.props?.promoIcon || 'Zap')}
      options={PROMO_ICON_OPTIONS}
      onSelect={(val) => handlePropChange('promoIcon', val)}
    />
  </div>

{:else if topBarType === 'delivery'}
  <div class="space-y-3 p-3 bg-orange-500/10 rounded-xl border border-orange-500/30">
    <div class="flex items-center gap-1.5 text-xs font-semibold text-orange-700 dark:text-orange-300">
      <Bike size={14} class="text-orange-500" />
      <span>Pengaturan Layanan Pesan Antar</span>
    </div>
    <div>
      <label for="delivery-text" class="block font-medium text-[11px] text-base-content/70 mb-1">Informasi Layanan Antar</label>
      <input
        id="delivery-text"
        type="text"
        value={stripEmoji(section.props?.deliveryText ?? 'Siap Kirim Instan: Estimasi 30 Menit')}
        on:input={(e) => handlePropChange('deliveryText', stripEmoji(e.currentTarget.value))}
        class="input input-bordered input-xs w-full"
        placeholder="Siap Kirim Instan: Estimasi 30 Menit"
      />
    </div>
    <div>
      <label for="delivery-partners" class="block font-medium text-[11px] text-base-content/70 mb-1">Mitra Layanan Kurir</label>
      <input
        id="delivery-partners"
        type="text"
        value={stripEmoji(section.props?.deliveryPartners ?? 'Tersedia GrabFood & GoFood')}
        on:input={(e) => handlePropChange('deliveryPartners', stripEmoji(e.currentTarget.value))}
        class="input input-bordered input-xs w-full"
        placeholder="Tersedia GrabFood & GoFood"
      />
    </div>
    <SearchableIconDropdown
      label="Ikon Layanan Kurir"
      selectedIcon={String(section.props?.deliveryIcon || 'Bike')}
      options={DELIVERY_ICON_OPTIONS}
      onSelect={(val) => handlePropChange('deliveryIcon', val)}
    />
  </div>

{:else if topBarType === 'promo'}
  <div class="space-y-3 p-3 bg-base-200/40 rounded-xl border border-base-200">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content">
        <Megaphone size={14} class="text-blue-500" />
        <span>Bar Pengumuman Promo</span>
      </div>
      <input
        type="checkbox"
        checked={showAnnouncement}
        on:change={(e) => handlePropChange('showAnnouncement', e.currentTarget.checked)}
        class="toggle toggle-primary toggle-sm"
      />
    </div>

    {#if showAnnouncement}
      <div class="space-y-2">
        <div>
          <label for="announcement-text" class="block font-medium text-[11px] text-base-content/70 mb-1">
            Teks Pengumuman Promo
          </label>
          <input
            id="announcement-text"
            type="text"
            value={stripEmoji(section.props?.announcementText ?? '')}
            on:input={(e) => handlePropChange('announcementText', stripEmoji(e.currentTarget.value))}
            class="input input-bordered input-xs w-full"
            placeholder="Diskon 20% khusus pesanan hari ini..."
          />
        </div>

        <div>
          <label for="free-shipping-text" class="block font-medium text-[11px] text-base-content/70 mb-1">
            Ketentuan Gratis Ongkir & Manfaat
          </label>
          <input
            id="free-shipping-text"
            type="text"
            value={stripEmoji(section.props?.freeShippingText ?? '')}
            on:input={(e) => handlePropChange('freeShippingText', stripEmoji(e.currentTarget.value))}
            class="input input-bordered input-xs w-full"
            placeholder="Gratis ongkir min. belanja Rp 250rb"
          />
        </div>
      </div>
    {/if}
  </div>
{/if}

<!-- Lencana Legalitas Toko (Khusus preset store_badge_highlight) -->
{#if isStoreBadge}
  <div class="space-y-3 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
    <div class="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
      <ShieldCheck size={14} class="text-emerald-500" />
      <span>Lencana Legalitas Toko</span>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div>
        <label for="bpom-text" class="block font-medium text-[11px] text-base-content/70 mb-1">Teks Lencana 1</label>
        <input
          id="bpom-text"
          type="text"
          value={stripEmoji(section.props?.bpomText ?? 'BPOM Terdaftar')}
          on:input={(e) => handlePropChange('bpomText', stripEmoji(e.currentTarget.value))}
          class="input input-bordered input-xs w-full"
          placeholder="BPOM Terdaftar"
        />
      </div>
      <div>
        <label for="halal-text" class="block font-medium text-[11px] text-base-content/70 mb-1">Teks Lencana 2</label>
        <input
          id="halal-text"
          type="text"
          value={stripEmoji(section.props?.halalText ?? 'Halal MUI')}
          on:input={(e) => handlePropChange('halalText', stripEmoji(e.currentTarget.value))}
          class="input input-bordered input-xs w-full"
          placeholder="Halal MUI"
        />
      </div>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <SearchableIconDropdown
        label="Ikon Lencana 1"
        selectedIcon={String(section.props?.bpomIcon || 'ShieldCheck')}
        options={BADGE_BPOM_ICON_OPTIONS}
        onSelect={(val) => handlePropChange('bpomIcon', val)}
      />
      <SearchableIconDropdown
        label="Ikon Lencana 2"
        selectedIcon={String(section.props?.halalIcon || 'CheckCircle2')}
        options={BADGE_HALAL_ICON_OPTIONS}
        onSelect={(val) => handlePropChange('halalIcon', val)}
      />
    </div>
  </div>
{/if}

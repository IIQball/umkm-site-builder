<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import { makeHandlePropChange } from './content.helpers';
  import { MAP_CTA_ICON_OPTIONS } from '../sections/maps/mapsIcons';
  import { DEFAULT_BRANCHES, type MapBranchItem } from '../sections/maps/maps.helpers';
  import { getEffectiveMapsElementOrder } from '../sections/maps/mapsLayout.helpers';
  import SearchableIconDropdown from '../inspector/SearchableIconDropdown.svelte';
  import MapsBranchTabsForm from '../inspector/node-forms/MapsBranchTabsForm.svelte';
  import MapsHeaderNodeForm from '../inspector/node-forms/MapsHeaderNodeForm.svelte';
  import MapsInfoCardNodeForm from '../inspector/node-forms/MapsInfoCardNodeForm.svelte';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: handlePropChange = makeHandlePropChange(section, onUpdate);

  $: preset = (section.layoutPreset || section.props?.layoutPreset || 'fullwidth_map') as string;
  $: branchMode = ((section.props?.branchMode as string) || (preset === 'multi_branch_tabs' ? 'multi' : 'single')) as 'single' | 'multi';
  $: elementOrder = getEffectiveMapsElementOrder(preset, section.props?.elementOrder, branchMode);

  $: markerTitle = (section.props?.markerTitle as string) ?? (section.props?.storeName as string) ?? 'Lokasi Toko Kami';
  $: address = (section.props?.address as string) ?? '';
  $: googleMapsUrl = (section.props?.googleMapsUrl as string) ?? '';
  $: storeHours = (section.props?.storeHours as string) ?? '';
  $: facilities = (section.props?.facilities as string) ?? '';
  $: storeHoursStatus = (section.props?.storeHoursStatus as string) ?? '';
  $: whatsappNumber = (section.props?.whatsappNumber as string) ?? '';
  $: directionsLandmark = (section.props?.directionsLandmark as string) ?? '';
  $: directionsParking = (section.props?.directionsParking as string) ?? '';

  $: zoom = typeof section.props?.zoom === 'number' ? section.props.zoom : 15;
  $: mapHeight = (section.props?.mapHeight as string) ?? '380px';

  $: badge = (section.props?.badgeText as string) || (section.props?.badge as string) || 'Lokasi Gerai Fisik';
  $: badgeIcon = (section.props?.badgeIcon as string) ?? 'map-pin';
  $: title = (section.props?.title as string) ?? 'Kunjungi Outlet Resmi Kami';
  $: subtitle = (section.props?.subtitle as string) ?? '';

  $: ctaText = (section.props?.ctaText as string) ?? 'Buka Petunjuk Arah';
  $: ctaIcon = (section.props?.ctaIcon as string) ?? 'navigation';

  $: branches = (Array.isArray(section.props?.branches) && section.props.branches.length > 0
    ? section.props.branches
    : DEFAULT_BRANCHES) as MapBranchItem[];

  $: showHeader = elementOrder.includes('badge') || elementOrder.includes('title') || elementOrder.includes('subtitle');
</script>

<div class="space-y-4 text-left">
  <!-- 1. Mode Pilihan Cabang Toko (Tersedia di Seluruh Layout) -->
  <div class="p-3 bg-base-200/40 border border-base-300 rounded-xl space-y-2">
    <span class="block text-xs font-bold text-base-content/80">Jumlah Cabang Toko</span>
    <div class="grid grid-cols-2 gap-2">
      <button
        type="button"
        on:click={() => handlePropChange('branchMode', 'single')}
        class={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
          branchMode === 'single' ? 'bg-primary text-primary-content border-primary shadow-xs' : 'bg-base-100 border-base-300 text-base-content/70 hover:bg-base-200'
        }`}
      >
        1 Cabang Saja
      </button>
      <button
        type="button"
        on:click={() => handlePropChange('branchMode', 'multi')}
        class={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
          branchMode === 'multi' ? 'bg-primary text-primary-content border-primary shadow-xs' : 'bg-base-100 border-base-300 text-base-content/70 hover:bg-base-200'
        }`}
      >
        Beberapa Cabang (Maks 5)
      </button>
    </div>
  </div>

  {#if branchMode === 'multi'}
    <div class="p-3 bg-base-200/30 border border-base-300 rounded-xl">
      <MapsBranchTabsForm
        {branches}
        onPropChange={(prop, val) => handlePropChange(prop, val)}
      />
    </div>
  {/if}

  <!-- 2. Header Section (Hanya jika didukung layout) -->
  {#if showHeader}
    <MapsHeaderNodeForm
      nodeId="maps_header"
      {badge}
      {badgeIcon}
      {title}
      {subtitle}
      onPropChange={handlePropChange}
    />
  {/if}

  <!-- 3. Kartu Informasi Gerai & Alamat (Hanya jika didukung layout) -->
  {#if elementOrder.includes('maps_info_card') || (branchMode === 'single' && !elementOrder.includes('maps_hours_card') && !elementOrder.includes('maps_directions_card'))}
    <MapsInfoCardNodeForm
      {markerTitle}
      {address}
      {googleMapsUrl}
      {storeHours}
      {facilities}
      onPropChange={handlePropChange}
    />
  {/if}

  <!-- 4. Bilah Jam Buka & Status Toko (Khusus layout store_hours_highlight) -->
  {#if elementOrder.includes('maps_hours_card')}
    <div class="p-3 bg-base-200/30 border border-base-300 rounded-xl space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">Status Jam Buka & Layanan</h4>
      <div>
        <label for="map-hours-status" class="block text-xs font-semibold text-base-content/70 mb-1">Status Buka Toko</label>
        <input
          id="map-hours-status"
          type="text"
          value={storeHoursStatus}
          on:input={(e) => handlePropChange('storeHoursStatus', e.currentTarget.value)}
          placeholder="BUKA SEKARANG"
          class="w-full px-3 py-1.5 bg-base-100 border border-base-300 rounded-lg text-xs"
        />
      </div>
      <div>
        <label for="map-hours-detail" class="block text-xs font-semibold text-base-content/70 mb-1">Keterangan Jam Operasional</label>
        <input
          id="map-hours-detail"
          type="text"
          value={storeHours}
          on:input={(e) => handlePropChange('storeHours', e.currentTarget.value)}
          placeholder="Tutup Pukul 21.00 WIB"
          class="w-full px-3 py-1.5 bg-base-100 border border-base-300 rounded-lg text-xs"
        />
      </div>
      <div>
        <label for="map-wa-number" class="block text-xs font-semibold text-base-content/70 mb-1">Nomor WhatsApp CS / Antrian</label>
        <input
          id="map-wa-number"
          type="text"
          value={whatsappNumber}
          on:input={(e) => handlePropChange('whatsappNumber', e.currentTarget.value)}
          placeholder="6281234567890"
          class="w-full px-3 py-1.5 bg-base-100 border border-base-300 rounded-lg text-xs font-mono"
        />
      </div>
    </div>
  {/if}

  <!-- 5. Kartu Panduan Rute & Parkir (Khusus layout two_column_directions) -->
  {#if elementOrder.includes('maps_directions_card')}
    <div class="p-3 bg-base-200/30 border border-base-300 rounded-xl space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">Panduan Rute Menuju Lokasi</h4>
      <div>
        <label for="map-landmark" class="block text-xs font-semibold text-base-content/70 mb-1">Patokan Terdekat (Landmark)</label>
        <textarea
          id="map-landmark"
          rows="2"
          value={directionsLandmark}
          on:input={(e) => handlePropChange('directionsLandmark', e.currentTarget.value)}
          placeholder="100 meter ke arah timur dari bundaran kota..."
          class="w-full px-3 py-1.5 bg-base-100 border border-base-300 rounded-lg text-xs resize-y"
        ></textarea>
      </div>
      <div>
        <label for="map-parking" class="block text-xs font-semibold text-base-content/70 mb-1">Keterangan Parkir Kendaraan</label>
        <textarea
          id="map-parking"
          rows="2"
          value={directionsParking}
          on:input={(e) => handlePropChange('directionsParking', e.currentTarget.value)}
          placeholder="Tersedia area parkir motor & mobil gratis..."
          class="w-full px-3 py-1.5 bg-base-100 border border-base-300 rounded-lg text-xs resize-y"
        ></textarea>
      </div>
    </div>
  {/if}

  <!-- 6. Tombol Petunjuk Arah CTA (Hanya jika didukung layout) -->
  {#if elementOrder.includes('maps_cta_button')}
    <div class="p-3 bg-base-200/30 border border-base-300 rounded-xl space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">Tombol Petunjuk Arah (CTA)</h4>
      <div>
        <label for="map-cta-text" class="block text-xs font-semibold text-base-content/80 mb-1">
          Teks Tombol Navigasi
        </label>
        <input
          id="map-cta-text"
          type="text"
          value={ctaText}
          on:input={(e) => handlePropChange('ctaText', e.currentTarget.value)}
          class="w-full px-3 py-1.5 bg-base-100 border border-base-300 rounded-lg text-xs"
          placeholder="Buka Petunjuk Arah"
        />
      </div>
      <div>
        <SearchableIconDropdown
          label="Pilih Ikon Tombol CTA"
          value={ctaIcon}
          selectedIcon={ctaIcon}
          options={MAP_CTA_ICON_OPTIONS}
          onSelect={(val) => handlePropChange('ctaIcon', val)}
        />
      </div>
    </div>
  {/if}

  <!-- 7. Bingkai Peta & Zoom (Hanya jika didukung layout) -->
  {#if elementOrder.includes('maps_iframe')}
    <div class="p-3 bg-base-200/30 border border-base-300 rounded-xl space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">Pengaturan Tampilan Peta</h4>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label for="map-zoom" class="block text-xs font-semibold text-base-content/80 mb-1">
            Zoom ({zoom})
          </label>
          <input
            id="map-zoom"
            type="range"
            min="10"
            max="19"
            step="1"
            value={zoom}
            on:input={(e) => handlePropChange('zoom', parseInt(e.currentTarget.value, 10))}
            class="w-full h-1.5 bg-base-300 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <div>
          <label for="map-height" class="block text-xs font-semibold text-base-content/80 mb-1">
            Tinggi Peta
          </label>
          <select
            id="map-height"
            value={mapHeight}
            on:change={(e) => handlePropChange('mapHeight', e.currentTarget.value)}
            class="w-full px-2 py-1.5 bg-base-100 border border-base-300 rounded-lg text-xs"
          >
            <option value="260px">260px (Ramping)</option>
            <option value="320px">320px (Kecil)</option>
            <option value="380px">380px (Standar)</option>
            <option value="420px">420px (Tinggi)</option>
            <option value="500px">500px (Lebar)</option>
          </select>
        </div>
      </div>
    </div>
  {/if}
</div>

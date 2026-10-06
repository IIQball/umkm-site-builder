<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import type { MapBranchItem } from '../../sections/maps/maps.helpers';
  import { DEFAULT_BRANCHES } from '../../sections/maps/maps.helpers';
  import { MAP_CTA_ICON_OPTIONS } from '../../sections/maps/mapsIcons';
  import SearchableIconDropdown from '../SearchableIconDropdown.svelte';
  import MapsBranchTabsForm from './MapsBranchTabsForm.svelte';
  import MapsHeaderNodeForm from './MapsHeaderNodeForm.svelte';
  import MapsInfoCardNodeForm from './MapsInfoCardNodeForm.svelte';
  import { maxStoreBranchesStore } from '../../stores/editorStore';

  export let section: TemplateSection;
  export let nodeId: string | null = null;
  export let onPropChange: (prop: string, val: unknown) => void;

  $: maxBranches = $maxStoreBranchesStore || 5;
  $: props = section.props || {};
  $: branches = (Array.isArray(props.branches) && props.branches.length > 0
    ? props.branches
    : DEFAULT_BRANCHES) as MapBranchItem[];

  $: badge = (props.badge as string) || '';
  $: badgeIcon = (props.badgeIcon as string) || 'map-pin';
  $: title = (props.title as string) || '';
  $: subtitle = (props.subtitle as string) || '';
  $: markerTitle = (props.markerTitle as string) || (props.storeName as string) || '';
  $: address = (props.address as string) || '';
  $: storeHours = (props.storeHours as string) || '';
  $: facilities = (props.facilities as string) || '';
  $: storeHoursStatus = (props.storeHoursStatus as string) || '';
  $: whatsappNumber = (props.whatsappNumber as string) || '';
  $: googleMapsUrl = (props.googleMapsUrl as string) || '';
  $: zoom = typeof props.zoom === 'number' ? props.zoom : 14;
  $: mapHeight = (props.mapHeight as string) || '380px';
  $: ctaText = (props.ctaText as string) || '';
  $: ctaIcon = (props.ctaIcon as string) || 'navigation';
  $: directionsLandmark = (props.directionsLandmark as string) || '';
  $: directionsParking = (props.directionsParking as string) || '';
  $: branchMode = ((props.branchMode as string) || (section.layoutPreset === 'multi_branch_tabs' ? 'multi' : 'single')) as 'single' | 'multi';

  $: isHeaderSlot = nodeId === 'maps_header' || nodeId === 'badge' || nodeId === 'title' || nodeId === 'subtitle';
</script>

<div class="space-y-4 text-left">
  {#if isHeaderSlot}
    <MapsHeaderNodeForm
      {nodeId}
      {badge}
      {badgeIcon}
      {title}
      {subtitle}
      {onPropChange}
    />

  {:else if nodeId === 'maps_branch_selector' || nodeId === 'maps_branch_tabs'}
    <div class="space-y-4">
      <div class="p-3 bg-base-200/40 border border-base-300 rounded-xl space-y-2">
        <span class="block text-xs font-bold text-base-content/80">Jumlah Cabang Toko</span>
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            on:click={() => onPropChange('branchMode', 'single')}
            class={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
              branchMode === 'single' ? 'bg-primary text-primary-content border-primary shadow-xs' : 'bg-base-100 border-base-300 text-base-content/70 hover:bg-base-200'
            }`}
          >
            1 Cabang Saja
          </button>
          <button
            type="button"
            on:click={() => onPropChange('branchMode', 'multi')}
            class={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
              branchMode === 'multi' ? 'bg-primary text-primary-content border-primary shadow-xs' : 'bg-base-100 border-base-300 text-base-content/70 hover:bg-base-200'
            }`}
          >
            Beberapa Cabang (Maks {maxBranches})
          </button>
        </div>
      </div>
      {#if branchMode === 'multi'}
        <MapsBranchTabsForm {branches} {maxBranches} {onPropChange} />
      {/if}
    </div>

  {:else if nodeId === 'maps_info_card'}
    <MapsInfoCardNodeForm
      {markerTitle}
      {address}
      {googleMapsUrl}
      {storeHours}
      {facilities}
      {onPropChange}
    />

  {:else if nodeId === 'maps_hours_card' || nodeId === 'maps_hours_badge'}
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">Status Jam Buka & Layanan</h4>
      <div>
        <label for="maps-hours-status" class="block text-xs font-semibold text-base-content/70 mb-1">Status Buka Toko</label>
        <input
          id="maps-hours-status"
          type="text"
          value={storeHoursStatus}
          on:input={(e) => onPropChange('storeHoursStatus', e.currentTarget.value)}
          placeholder="BUKA SEKARANG"
          class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
        />
      </div>
      <div>
        <label for="maps-hours-detail" class="block text-xs font-semibold text-base-content/70 mb-1">Keterangan Jam Operasional</label>
        <input
          id="maps-hours-detail"
          type="text"
          value={storeHours}
          on:input={(e) => onPropChange('storeHours', e.currentTarget.value)}
          placeholder="Tutup Pukul 21.00 WIB"
          class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
        />
      </div>
      <div>
        <label for="maps-wa-number" class="block text-xs font-semibold text-base-content/70 mb-1">Nomor WhatsApp CS / Antrian</label>
        <input
          id="maps-wa-number"
          type="text"
          value={whatsappNumber}
          on:input={(e) => onPropChange('whatsappNumber', e.currentTarget.value)}
          placeholder="6281234567890"
          class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs font-mono"
        />
      </div>
    </div>

  {:else if nodeId === 'maps_directions_card'}
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">Panduan Rute Menuju Lokasi</h4>
      <div>
        <label for="maps-landmark" class="block text-xs font-semibold text-base-content/70 mb-1">Patokan Terdekat (Landmark)</label>
        <textarea
          id="maps-landmark"
          rows="2"
          value={directionsLandmark}
          on:input={(e) => onPropChange('directionsLandmark', e.currentTarget.value)}
          placeholder="100 meter ke arah timur dari bundaran kota..."
          class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs resize-y"
        ></textarea>
      </div>
      <div>
        <label for="maps-parking" class="block text-xs font-semibold text-base-content/70 mb-1">Keterangan Parkir Kendaraan</label>
        <textarea
          id="maps-parking"
          rows="2"
          value={directionsParking}
          on:input={(e) => onPropChange('directionsParking', e.currentTarget.value)}
          placeholder="Lahan parkir aman memuat mobil dan motor..."
          class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs resize-y"
        ></textarea>
      </div>
    </div>

  {:else if nodeId === 'maps_cta_button'}
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">Tombol Petunjuk Arah (CTA)</h4>
      <div>
        <label for="maps-cta-text" class="block text-xs font-semibold text-base-content/70 mb-1">Teks Tombol</label>
        <input
          id="maps-cta-text"
          type="text"
          value={ctaText}
          on:input={(e) => onPropChange('ctaText', e.currentTarget.value)}
          placeholder="Buka Petunjuk Arah"
          class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
        />
      </div>
      <div>
        <SearchableIconDropdown
          label="Pilih Ikon Tombol"
          value={ctaIcon}
          selectedIcon={ctaIcon}
          options={MAP_CTA_ICON_OPTIONS}
          onSelect={(val) => onPropChange('ctaIcon', val)}
        />
      </div>
      <div>
        <label for="maps-direct-url" class="block text-xs font-semibold text-base-content/70 mb-1">URL Tujuan Google Maps (Opsional)</label>
        <input
          id="maps-direct-url"
          type="text"
          value={googleMapsUrl}
          on:input={(e) => onPropChange('googleMapsUrl', e.currentTarget.value)}
          placeholder="https://maps.google.com/?q=..."
          class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs font-mono"
        />
      </div>
    </div>

  {:else}
    <!-- Default: maps_iframe -->
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">Pengaturan Bingkai Peta (Google Maps)</h4>
      <div>
        <label for="maps-embed-url" class="block text-xs font-semibold text-base-content/70 mb-1">Link Google Maps / Alamat Pencarian</label>
        <input
          id="maps-embed-url"
          type="text"
          value={googleMapsUrl || address}
          on:input={(e) => onPropChange('googleMapsUrl', e.currentTarget.value)}
          placeholder="https://maps.google.com/maps?q=... atau nama jalan"
          class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs font-mono"
        />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label for="maps-zoom" class="block text-xs font-semibold text-base-content/70 mb-1">Zoom ({zoom})</label>
          <input
            id="maps-zoom"
            type="range"
            min="10"
            max="19"
            step="1"
            value={zoom}
            on:input={(e) => onPropChange('zoom', parseInt(e.currentTarget.value, 10))}
            class="w-full h-1.5 bg-base-300 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
        <div>
          <label for="maps-height" class="block text-xs font-semibold text-base-content/70 mb-1">Tinggi Peta</label>
          <select
            id="maps-height"
            value={mapHeight}
            on:change={(e) => onPropChange('mapHeight', e.currentTarget.value)}
            class="w-full px-2 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
          >
            <option value="260px">260px (Ramping)</option>
            <option value="350px">350px (Sedang)</option>
            <option value="380px">380px (Standar)</option>
            <option value="420px">420px (Tinggi)</option>
            <option value="500px">500px (Lebar)</option>
          </select>
        </div>
      </div>
    </div>
  {/if}
</div>

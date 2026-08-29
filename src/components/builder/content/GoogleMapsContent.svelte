<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import { makeHandlePropChange } from './content.helpers';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: handlePropChange = makeHandlePropChange(section, onUpdate);
  $: markerTitle = (section.props?.markerTitle as string) ?? 'Lokasi Toko Kami';
  $: address = (section.props?.address as string) ?? '';
  $: zoom = typeof section.props?.zoom === 'number' ? section.props.zoom : 15;
  $: mapHeight = (section.props?.mapHeight as string) ?? '400px';
</script>

<div class="space-y-3">
  <div>
    <label for="map-marker-title" class="block font-semibold text-base-content/80 mb-1">
      Judul Penanda / Lokasi
    </label>
    <input
      id="map-marker-title"
      type="text"
      value={markerTitle}
      on:input={(e) => handlePropChange('markerTitle', e.currentTarget.value)}
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
      placeholder="Lokasi Toko Kami"
    />
  </div>

  <div>
    <label for="map-address" class="block font-semibold text-base-content/80 mb-1">
      Alamat Lengkap (Pencarian Maps)
    </label>
    <textarea
      id="map-address"
      value={address}
      on:input={(e) => handlePropChange('address', e.currentTarget.value)}
      rows="3"
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500 resize-y"
      placeholder="Jl. Merdeka Barat No. 12, Gambir, Jakarta Pusat"
    />
    <p class="text-[11px] text-base-content/50 mt-1">
      Peta akan otomatis mencari koordinat dari teks alamat ini.
    </p>
  </div>

  <div class="grid grid-cols-2 gap-3">
    <div>
      <label for="map-zoom" class="block font-semibold text-base-content/80 mb-1">
        Tingkat Zoom ({zoom})
      </label>
      <input
        id="map-zoom"
        type="range"
        min="10"
        max="19"
        step="1"
        value={zoom}
        on:input={(e) => handlePropChange('zoom', parseInt(e.currentTarget.value, 10))}
        class="w-full h-2 bg-base-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
    </div>

    <div>
      <label for="map-height" class="block font-semibold text-base-content/80 mb-1">
        Tinggi Peta
      </label>
      <select
        id="map-height"
        value={mapHeight}
        on:change={(e) => handlePropChange('mapHeight', e.currentTarget.value)}
        class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content focus:outline-none focus:border-blue-500 text-xs"
      >
        <option value="320px">320px (Kecil)</option>
        <option value="400px">400px (Standar)</option>
        <option value="480px">480px (Besar)</option>
        <option value="560px">560px (Ekstra Besar)</option>
      </select>
    </div>
  </div>
</div>

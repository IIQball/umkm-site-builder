<script lang="ts">
  export let markerTitle: string = '';
  export let address: string = '';
  export let googleMapsUrl: string = '';
  export let storeHours: string = '';
  export let facilities: string = '';
  export let onPropChange: (prop: string, val: unknown) => void;
</script>

<div class="space-y-3 text-left">
  <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">Informasi Alamat & Gerai</h4>
  <div>
    <label for="maps-marker-title" class="block text-xs font-semibold text-base-content/70 mb-1">Nama Toko / Gerai</label>
    <input
      id="maps-marker-title"
      type="text"
      value={markerTitle}
      on:input={(e) => onPropChange('markerTitle', e.currentTarget.value)}
      placeholder="Warung Khas Banyuwangi"
      class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
    />
  </div>
  <div>
    <label for="maps-address" class="block text-xs font-semibold text-base-content/70 mb-1">Alamat Lengkap (Bahasa Manusia)</label>
    <textarea
      id="maps-address"
      rows="3"
      value={address}
      on:input={(e) => onPropChange('address', e.currentTarget.value)}
      placeholder="Jl. Raya Sukowati No. 42, Krajan Kidul, Banyuwangi"
      class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs resize-y"
    ></textarea>
  </div>
  <div>
    <label for="maps-info-url" class="block text-xs font-semibold text-base-content/70 mb-1">Link Google Maps (Preview & Petunjuk Arah)</label>
    <input
      id="maps-info-url"
      type="text"
      value={googleMapsUrl}
      on:input={(e) => onPropChange('googleMapsUrl', e.currentTarget.value)}
      placeholder="https://maps.google.com/?q=..."
      class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs font-mono"
    />
  </div>
  <div>
    <label for="maps-store-hours" class="block text-xs font-semibold text-base-content/70 mb-1">Jam Operasional</label>
    <input
      id="maps-store-hours"
      type="text"
      value={storeHours}
      on:input={(e) => onPropChange('storeHours', e.currentTarget.value)}
      placeholder="Setiap Hari (08.00 - 21.00 WIB)"
      class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
    />
  </div>
  <div>
    <label for="maps-facilities" class="block text-xs font-semibold text-base-content/70 mb-1">Fasilitas Gerai</label>
    <input
      id="maps-facilities"
      type="text"
      value={facilities}
      on:input={(e) => onPropChange('facilities', e.currentTarget.value)}
      placeholder="Parkir Luas, Musholla, Toilet Bersih"
      class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
    />
  </div>
</div>

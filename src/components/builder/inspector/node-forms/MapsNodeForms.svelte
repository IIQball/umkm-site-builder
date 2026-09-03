<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import type { MapBranchItem } from '../../sections/maps/maps.helpers';
  import { DEFAULT_BRANCHES } from '../../sections/maps/maps.helpers';

  export let section: TemplateSection;
  export let nodeId: string | null = null;
  export let onPropChange: (prop: string, val: unknown) => void;

  $: props = section.props || {};
  $: branches = (Array.isArray(props.branches) && props.branches.length > 0
    ? props.branches
    : DEFAULT_BRANCHES) as MapBranchItem[];

  $: badge = (props.badge as string) || '';
  $: title = (props.title as string) || '';
  $: subtitle = (props.subtitle as string) || '';
  $: markerTitle = (props.markerTitle as string) || '';
  $: address = (props.address as string) || '';
  $: storeHours = (props.storeHours as string) || '';
  $: facilities = (props.facilities as string) || '';
  $: storeHoursStatus = (props.storeHoursStatus as string) || '';
  $: whatsappNumber = (props.whatsappNumber as string) || '';
  $: googleMapsUrl = (props.googleMapsUrl as string) || '';
  $: zoom = typeof props.zoom === 'number' ? props.zoom : 14;
  $: mapHeight = (props.mapHeight as string) || '380px';

  function updateBranchField(idx: number, field: keyof MapBranchItem, value: string) {
    const updated = branches.map((item, i) => (i === idx ? { ...item, [field]: value } : item));
    onPropChange('branches', updated);
  }

  function addBranch() {
    const newBranch: MapBranchItem = {
      id: `branch_${Date.now()}`,
      name: `Cabang Baru #${branches.length + 1}`,
      address: 'Jl. Raya Baru, Banyuwangi',
    };
    onPropChange('branches', [...branches, newBranch]);
  }

  function removeBranch(idx: number) {
    if (branches.length <= 1) return;
    const updated = branches.filter((_, i) => i !== idx);
    onPropChange('branches', updated);
  }
</script>

<div class="space-y-4 text-left">
  {#if nodeId === 'maps_header'}
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">
        Pengaturan Judul & Badge Lokasi
      </h4>
      <div>
        <label for="maps-badge" class="block text-xs font-semibold text-base-content/70 mb-1">
          Promo Badge / Label
        </label>
        <input
          id="maps-badge"
          type="text"
          value={badge}
          on:input={(e) => onPropChange('badge', e.currentTarget.value)}
          placeholder="Lokasi Gerai Fisik"
          class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
        />
      </div>
      <div>
        <label for="maps-title" class="block text-xs font-semibold text-base-content/70 mb-1">
          Judul Section (H2)
        </label>
        <input
          id="maps-title"
          type="text"
          value={title}
          on:input={(e) => onPropChange('title', e.currentTarget.value)}
          placeholder="Kunjungi Outlet Resmi Kami"
          class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
        />
      </div>
      <div>
        <label for="maps-subtitle" class="block text-xs font-semibold text-base-content/70 mb-1">
          Deskripsi Subtitle
        </label>
        <textarea
          id="maps-subtitle"
          rows="2"
          value={subtitle}
          on:input={(e) => onPropChange('subtitle', e.currentTarget.value)}
          placeholder="Kunjungi outlet dan gerai kami untuk mencicipi langsung..."
          class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs resize-y"
        ></textarea>
      </div>
    </div>

  {:else if nodeId === 'maps_info_card'}
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">
        Informasi Alamat & Gerai
      </h4>
      <div>
        <label for="maps-marker-title" class="block text-xs font-semibold text-base-content/70 mb-1">
          Nama Toko / Gerai
        </label>
        <input
          id="maps-marker-title"
          type="text"
          value={markerTitle}
          on:input={(e) => onPropChange('markerTitle', e.currentTarget.value)}
          placeholder="Warung Khas Banyuwangi"
          class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
        />
      </div>
      <div>
        <label for="maps-address" class="block text-xs font-semibold text-base-content/70 mb-1">
          Alamat Lengkap
        </label>
        <textarea
          id="maps-address"
          rows="3"
          value={address}
          on:input={(e) => onPropChange('address', e.currentTarget.value)}
          placeholder="Jl. Raya Sukowati No. 42, Krajan Kidul, Banyuwangi"
          class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs resize-y"
        ></textarea>
      </div>
      <div>
        <label for="maps-store-hours" class="block text-xs font-semibold text-base-content/70 mb-1">
          Jam Operasional
        </label>
        <input
          id="maps-store-hours"
          type="text"
          value={storeHours}
          on:input={(e) => onPropChange('storeHours', e.currentTarget.value)}
          placeholder="Setiap Hari (08.00 - 21.00 WIB)"
          class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
        />
      </div>
      <div>
        <label for="maps-facilities" class="block text-xs font-semibold text-base-content/70 mb-1">
          Fasilitas Toko (Parkir, Wifi, dll.)
        </label>
        <input
          id="maps-facilities"
          type="text"
          value={facilities}
          on:input={(e) => onPropChange('facilities', e.currentTarget.value)}
          placeholder="Parkir Mobil/Bus Luas, Musholla, Toilet Bersih"
          class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
        />
      </div>
    </div>

  {:else if nodeId === 'maps_hours_badge'}
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">
        Status Jam Buka & Layanan
      </h4>
      <div>
        <label for="maps-hours-status" class="block text-xs font-semibold text-base-content/70 mb-1">
          Status Buka Toko
        </label>
        <input
          id="maps-hours-status"
          type="text"
          value={storeHoursStatus}
          on:input={(e) => onPropChange('storeHoursStatus', e.currentTarget.value)}
          placeholder="BUKA SEKARANG"
          class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
        />
      </div>
      <div>
        <label for="maps-hours-detail" class="block text-xs font-semibold text-base-content/70 mb-1">
          Keterangan Jam Tutup
        </label>
        <input
          id="maps-hours-detail"
          type="text"
          value={storeHours}
          on:input={(e) => onPropChange('storeHours', e.currentTarget.value)}
          placeholder="Tutup Pukul 21.00 WIB"
          class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
        />
      </div>
      <div>
        <label for="maps-wa-number" class="block text-xs font-semibold text-base-content/70 mb-1">
          Nomor WhatsApp Antrian / Tanya CS
        </label>
        <input
          id="maps-wa-number"
          type="text"
          value={whatsappNumber}
          on:input={(e) => onPropChange('whatsappNumber', e.currentTarget.value)}
          placeholder="6281234567890"
          class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs font-mono"
        />
      </div>
    </div>

  {:else if nodeId === 'maps_branch_tabs'}
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">
          Daftar Cabang Toko ({branches.length})
        </h4>
        <button
          type="button"
          on:click={addBranch}
          class="text-xs text-primary hover:underline font-bold"
        >
          + Tambah Cabang
        </button>
      </div>

      {#each branches as branch, idx}
        <div class="p-3 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-xl space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-base-content">Cabang #{idx + 1}</span>
            {#if branches.length > 1}
              <button
                type="button"
                on:click={() => removeBranch(idx)}
                class="text-[10px] text-rose-500 hover:underline font-semibold"
              >
                Hapus
              </button>
            {/if}
          </div>
          <div>
            <label for={`branch-name-${idx}`} class="block text-[11px] font-semibold text-base-content/60 mb-0.5">Nama Cabang</label>
            <input
              id={`branch-name-${idx}`}
              type="text"
              value={branch.name}
              on:input={(e) => updateBranchField(idx, 'name', e.currentTarget.value)}
              class="w-full px-2 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded text-xs"
            />
          </div>
          <div>
            <label for={`branch-address-${idx}`} class="block text-[11px] font-semibold text-base-content/60 mb-0.5">Alamat Cabang</label>
            <input
              id={`branch-address-${idx}`}
              type="text"
              value={branch.address}
              on:input={(e) => updateBranchField(idx, 'address', e.currentTarget.value)}
              class="w-full px-2 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded text-xs"
            />
          </div>
        </div>
      {/each}
    </div>

  {:else if nodeId === 'maps_cta_button'}
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">
        Tombol Petunjuk Arah
      </h4>
      <div>
        <label for="maps-direct-url" class="block text-xs font-semibold text-base-content/70 mb-1">
          URL Tujuan Google Maps (External Link)
        </label>
        <input
          id="maps-direct-url"
          type="text"
          value={googleMapsUrl}
          on:input={(e) => onPropChange('googleMapsUrl', e.currentTarget.value)}
          placeholder="https://maps.google.com/?q=..."
          class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs font-mono"
        />
        <p class="text-[10px] text-base-content/50 mt-1">
          Kosongkan untuk membuat URL otomatis dari nama alamat toko.
        </p>
      </div>
    </div>

  {:else}
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">
        Pengaturan Iframe Peta
      </h4>
      <div>
        <label for="maps-embed-url" class="block text-xs font-semibold text-base-content/70 mb-1">
          Google Maps Embed URL / Alamat Pencarian
        </label>
        <input
          id="maps-embed-url"
          type="text"
          value={googleMapsUrl || address}
          on:input={(e) => onPropChange('googleMapsUrl', e.currentTarget.value)}
          placeholder="https://maps.google.com/maps?q=...&output=embed"
          class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs font-mono"
        />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label for="maps-zoom" class="block text-xs font-semibold text-base-content/70 mb-1">
            Zoom ({zoom})
          </label>
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
          <label for="maps-height" class="block text-xs font-semibold text-base-content/70 mb-1">
            Tinggi Frame Peta
          </label>
          <select
            id="maps-height"
            value={mapHeight}
            on:change={(e) => onPropChange('mapHeight', e.currentTarget.value)}
            class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
          >
            <option value="260px">260px (Ramping)</option>
            <option value="350px">350px (Sedang)</option>
            <option value="420px">420px (Tinggi)</option>
            <option value="500px">500px (Lebar)</option>
          </select>
        </div>
      </div>
    </div>
  {/if}
</div>

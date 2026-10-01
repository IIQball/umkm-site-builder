<script lang="ts">
  import { MAP_ICON_OPTIONS } from '../../sections/maps/mapsIcons';
  import SearchableIconDropdown from '../SearchableIconDropdown.svelte';

  export let nodeId: string | null = null;
  export let badge: string = '';
  export let badgeIcon: string = 'map-pin';
  export let title: string = '';
  export let subtitle: string = '';
  export let onPropChange: (prop: string, val: unknown) => void;
</script>

<div class="space-y-4 text-left">
  {#if nodeId === 'badge'}
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">Pengaturan Lencana (Badge)</h4>
      <div>
        <label for="maps-badge" class="block text-xs font-semibold text-base-content/70 mb-1">Teks Lencana</label>
        <input
          id="maps-badge"
          type="text"
          value={badge}
          on:input={(e) => {
            onPropChange('badge', e.currentTarget.value);
            onPropChange('badgeText', e.currentTarget.value);
          }}
          placeholder="Lokasi Gerai Fisik"
          class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
        />
      </div>
      <div>
        <SearchableIconDropdown
          label="Pilih Ikon Lencana"
          value={badgeIcon}
          selectedIcon={badgeIcon}
          options={MAP_ICON_OPTIONS}
          onSelect={(val) => onPropChange('badgeIcon', val)}
        />
      </div>
    </div>

  {:else if nodeId === 'title'}
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">Pengaturan Judul Utama (H2)</h4>
      <div>
        <label for="maps-title" class="block text-xs font-semibold text-base-content/70 mb-1">Teks Judul</label>
        <input
          id="maps-title"
          type="text"
          value={title}
          on:input={(e) => onPropChange('title', e.currentTarget.value)}
          placeholder="Kunjungi Outlet Resmi Kami"
          class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
        />
      </div>
    </div>

  {:else if nodeId === 'subtitle'}
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">Pengaturan Subjudul</h4>
      <div>
        <label for="maps-subtitle" class="block text-xs font-semibold text-base-content/70 mb-1">Deskripsi Subjudul</label>
        <textarea
          id="maps-subtitle"
          rows="3"
          value={subtitle}
          on:input={(e) => onPropChange('subtitle', e.currentTarget.value)}
          placeholder="Kunjungi outlet dan gerai kami untuk melihat dan membeli produk secara langsung..."
          class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs resize-y"
        ></textarea>
      </div>
    </div>

  {:else if nodeId === 'maps_header'}
    <div class="space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">Pengaturan Judul & Badge Lokasi</h4>
      <div>
        <label for="maps-badge-head" class="block text-xs font-semibold text-base-content/70 mb-1">Teks Lencana</label>
        <input
          id="maps-badge-head"
          type="text"
          value={badge}
          on:input={(e) => {
            onPropChange('badge', e.currentTarget.value);
            onPropChange('badgeText', e.currentTarget.value);
          }}
          placeholder="Lokasi Gerai Fisik"
          class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
        />
      </div>
      <div>
        <label for="maps-title-head" class="block text-xs font-semibold text-base-content/70 mb-1">Judul Section (H2)</label>
        <input
          id="maps-title-head"
          type="text"
          value={title}
          on:input={(e) => onPropChange('title', e.currentTarget.value)}
          placeholder="Kunjungi Outlet Resmi Kami"
          class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
        />
      </div>
    </div>
  {/if}
</div>

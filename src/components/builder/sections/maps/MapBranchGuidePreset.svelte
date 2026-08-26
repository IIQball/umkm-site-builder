<script lang="ts">
  import { Navigation, Compass, Building2 } from 'lucide-svelte';

  export let mapEmbedUrl: string;
  export let activeAddress: string;
  export let markerTitle: string;
  export let activePreset: string;
  export let branches: Array<{ name: string; address: string; city: string; phone: string }>;
  export let selectedBranchIdx: number;
  export let selectBranch: (idx: number) => void;

  void markerTitle;
</script>

{#if activePreset === 'multi_branch_map'}
  <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
    <div class="md:col-span-5 space-y-3">
      <span class="block font-bold text-xs text-base-content/60 uppercase tracking-wider">Pilih Cabang / Outlet</span>
      {#each branches as branch, idx}
        <button
          type="button"
          on:click={() => selectBranch(idx)}
          class="w-full text-left p-4 rounded-2xl border transition-all cursor-pointer {selectedBranchIdx === idx ? 'border-primary bg-primary/5 shadow-sm' : 'border-base-200 dark:border-slate-800 bg-base-100 dark:bg-slate-900'}"
        >
          <div class="flex items-center gap-2.5">
            <Building2 size={16} class={selectedBranchIdx === idx ? 'text-primary' : 'text-base-content/40'} />
            <h4 class="font-bold text-xs text-base-content">{branch.name}</h4>
          </div>
          <p class="text-[11px] text-base-content/60 mt-1 pl-6">{branch.address}</p>
        </button>
      {/each}
    </div>

    <div class="md:col-span-7 h-96 rounded-2xl overflow-hidden shadow-lg border border-base-200 dark:border-slate-800">
      <iframe src={mapEmbedUrl} title="Google Maps" width="100%" height="100%" style="border:0;" loading="lazy" allowfullscreen></iframe>
    </div>
  </div>

{:else if activePreset === 'route_guide_map'}
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="p-4 rounded-xl border border-base-200 dark:border-slate-800 bg-base-100 dark:bg-slate-900 flex items-start gap-3">
        <Compass size={18} class="text-primary flex-shrink-0 mt-0.5" />
        <div>
          <h4 class="font-bold text-xs text-base-content">Dari Stasiun / Terminal</h4>
          <p class="text-[11px] text-base-content/60 mt-0.5">10 menit ke arah selatan via jalan utama.</p>
        </div>
      </div>
      <div class="p-4 rounded-xl border border-base-200 dark:border-slate-800 bg-base-100 dark:bg-slate-900 flex items-start gap-3">
        <Compass size={18} class="text-primary flex-shrink-0 mt-0.5" />
        <div>
          <h4 class="font-bold text-xs text-base-content">Patokan Lokasi</h4>
          <p class="text-[11px] text-base-content/60 mt-0.5">Tepat di seberang SPBU pusat kota.</p>
        </div>
      </div>
      <div class="p-4 rounded-xl border border-base-200 dark:border-slate-800 bg-base-100 dark:bg-slate-900 flex items-start gap-3">
        <Compass size={18} class="text-primary flex-shrink-0 mt-0.5" />
        <div>
          <h4 class="font-bold text-xs text-base-content">Area Parkir</h4>
          <p class="text-[11px] text-base-content/60 mt-0.5">Parkir luas untuk motor & mobil.</p>
        </div>
      </div>
    </div>

    <div class="h-96 rounded-2xl overflow-hidden shadow-lg border border-base-200 dark:border-slate-800">
      <iframe src={mapEmbedUrl} title="Google Maps" width="100%" height="100%" style="border:0;" loading="lazy" allowfullscreen></iframe>
    </div>
  </div>

{:else}
  <!-- minimal_map_action -->
  <div class="max-w-3xl mx-auto space-y-4">
    <div class="h-80 rounded-2xl overflow-hidden shadow-md border border-base-200 dark:border-slate-800">
      <iframe src={mapEmbedUrl} title="Google Maps" width="100%" height="100%" style="border:0;" loading="lazy" allowfullscreen></iframe>
    </div>
    <div class="flex items-center justify-between p-4 rounded-xl bg-base-200/40 dark:bg-slate-900/40">
      <p class="text-xs text-base-content/80 font-medium">{activeAddress}</p>
      <a
        href="https://maps.google.com/?q={encodeURIComponent(activeAddress)}"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white cursor-pointer flex-shrink-0"
        style:background-color="var(--theme-primary)"
      >
        <Navigation size={13} />
        <span>Rute</span>
      </a>
    </div>
  </div>
{/if}

<script lang="ts">
  import { Button, Badge } from '@/components/ui';
  import type { MapBranchItem } from '../../sections/maps/maps.helpers';
  import { maxStoreBranchesStore } from '../../stores/editorStore';

  export let branches: MapBranchItem[] = [];
  export let maxBranches: number = 5;
  export let onPropChange: (prop: string, val: unknown) => void;

  $: effectiveMaxBranches = maxBranches || $maxStoreBranchesStore || 5;

  function updateBranchField(idx: number, field: keyof MapBranchItem, value: string) {
    const updated = branches.map((item, i) => (i === idx ? { ...item, [field]: value } : item));
    onPropChange('branches', updated);
  }

  function addBranch() {
    if (branches.length >= effectiveMaxBranches) return;
    const newBranch: MapBranchItem = {
      id: `branch_${Date.now()}`,
      name: `Cabang Baru #${branches.length + 1}`,
      address: 'Jl. Raya Baru No. 1, Banyuwangi',
      googleMapsUrl: '',
    };
    onPropChange('branches', [...branches, newBranch]);
  }

  function removeBranch(idx: number) {
    const updated = branches.filter((_, i) => i !== idx);
    onPropChange('branches', updated);
  }
</script>

<div class="space-y-3">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-1.5">
      <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">
        Daftar Cabang Toko ({branches.length}/{effectiveMaxBranches})
      </h4>
      {#if branches.length >= effectiveMaxBranches}
        <Badge variant="warning" size="sm" dot={false}>Maks {effectiveMaxBranches} Cabang</Badge>
      {/if}
    </div>
    <Button
      type="button"
      size="xs"
      variant="ghost"
      disabled={branches.length >= effectiveMaxBranches}
      on:click={addBranch}
      class="!px-2 !py-0.5 !h-auto !min-h-0 text-xs text-primary font-bold hover:underline disabled:opacity-40"
    >
      + Tambah Cabang
    </Button>
  </div>

  {#each branches.slice(0, effectiveMaxBranches) as branch, idx}
    <div class="p-3 bg-base-200/50 border border-base-300 rounded-xl space-y-2">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-base-content">Cabang #{idx + 1}</span>
        {#if branches.length > 1}
          <Button
            type="button"
            variant="ghost"
            size="xs"
            on:click={() => removeBranch(idx)}
            class="!px-1.5 !py-0.5 !h-auto !min-h-0 text-[10px] text-rose-500 font-semibold hover:underline"
          >
            Hapus
          </Button>
        {/if}
      </div>
      <div>
        <label for={`branch-name-${idx}`} class="block text-[11px] font-semibold text-base-content/60 mb-0.5">Nama Cabang</label>
        <input
          id={`branch-name-${idx}`}
          type="text"
          value={branch.name}
          on:input={(e) => updateBranchField(idx, 'name', e.currentTarget.value)}
          placeholder="Cabang Utama (Pusat Kota)"
          class="w-full px-2 py-1 bg-base-100 border border-base-300 rounded text-xs"
        />
      </div>
      <div>
        <label for={`branch-address-${idx}`} class="block text-[11px] font-semibold text-base-content/60 mb-0.5">Alamat Cabang (Bahasa Manusia)</label>
        <input
          id={`branch-address-${idx}`}
          type="text"
          value={branch.address}
          on:input={(e) => updateBranchField(idx, 'address', e.currentTarget.value)}
          placeholder="Jl. Ahmad Yani No. 12, Pusat Kota, Banyuwangi"
          class="w-full px-2 py-1 bg-base-100 border border-base-300 rounded text-xs"
        />
      </div>
      <div>
        <label for={`branch-maps-url-${idx}`} class="block text-[11px] font-semibold text-base-content/60 mb-0.5">Link Google Maps (Preview & Petunjuk Arah)</label>
        <input
          id={`branch-maps-url-${idx}`}
          type="text"
          value={branch.googleMapsUrl || ''}
          on:input={(e) => updateBranchField(idx, 'googleMapsUrl', e.currentTarget.value)}
          placeholder="https://maps.google.com/?q=..."
          class="w-full px-2 py-1 bg-base-100 border border-base-300 rounded text-xs font-mono"
        />
      </div>
    </div>
  {/each}
</div>

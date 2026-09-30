<script lang="ts">
  import { Button } from '@/components/ui';
  import type { MapBranchItem } from '../../sections/maps/maps.helpers';

  export let branches: MapBranchItem[] = [];
  export let onPropChange: (prop: string, val: unknown) => void;

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
    const updated = branches.filter((_, i) => i !== idx);
    onPropChange('branches', updated);
  }
</script>

<div class="space-y-3">
  <div class="flex items-center justify-between">
    <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/60">
      Daftar Cabang Toko ({branches.length})
    </h4>
    <Button
      type="button"
      size="xs"
      variant="ghost"
      on:click={addBranch}
      class="!px-2 !py-0.5 !h-auto !min-h-0 text-xs text-primary font-bold hover:underline"
    >
      + Tambah Cabang
    </Button>
  </div>

  {#each branches as branch, idx}
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
          class="w-full px-2 py-1 bg-base-100 border border-base-300 rounded text-xs"
        />
      </div>
      <div>
        <label for={`branch-address-${idx}`} class="block text-[11px] font-semibold text-base-content/60 mb-0.5">Alamat Cabang</label>
        <input
          id={`branch-address-${idx}`}
          type="text"
          value={branch.address}
          on:input={(e) => updateBranchField(idx, 'address', e.currentTarget.value)}
          class="w-full px-2 py-1 bg-base-100 border border-base-300 rounded text-xs"
        />
      </div>
    </div>
  {/each}
</div>

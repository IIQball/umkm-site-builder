<script lang="ts">
  import { onMount } from 'svelte';
  import { Plus, Trash2, MapPin, Building2, Store } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import type { StoreBranchItem } from '../onboarding.types';

  export let branchMode: 'single' | 'multi' = 'single';
  export let branches: StoreBranchItem[] = [];
  export let primaryStoreName: string = '';
  export let primaryAddress: string = '';
  export let primaryMapsUrl: string = '';
  export let maxBranches: number = 5;

  onMount(async () => {
    try {
      const res = await fetch('/api/public/platform-settings');
      const result = await res.json();
      if (result.ok && result.data && typeof result.data.maxStoreBranches === 'number') {
        maxBranches = result.data.maxStoreBranches;
      }
    } catch {
      // Keep prop value
    }
  });

  function ensureInitialBranch() {
    if (branches.length === 0) {
      branches = [
        {
          id: `branch_${Date.now()}`,
          name: primaryStoreName ? `${primaryStoreName} (Pusat)` : 'Cabang Utama (Pusat)',
          address: primaryAddress || '',
          googleMapsUrl: primaryMapsUrl || '',
        },
      ];
    }
  }

  function handleModeChange(mode: 'single' | 'multi') {
    branchMode = mode;
    if (mode === 'multi') {
      ensureInitialBranch();
    }
  }

  function addBranch() {
    if (branches.length >= maxBranches) return;
    const nextIdx = branches.length + 1;
    const newBranch: StoreBranchItem = {
      id: `branch_${Date.now()}`,
      name: `Cabang #${nextIdx}`,
      address: '',
      googleMapsUrl: '',
    };
    branches = [...branches, newBranch];
  }

  function removeBranch(idx: number) {
    if (branches.length <= 1) return;
    branches = branches.filter((_, i) => i !== idx);
  }

  function updateBranch(idx: number, field: keyof StoreBranchItem, value: string) {
    branches = branches.map((b, i) => (i === idx ? { ...b, [field]: value } : b));
  }
</script>

<div class="space-y-3 pt-2">
  <!-- Mode Selector: 1 Cabang vs Multi Cabang -->
  <div class="p-3 bg-nested rounded-xl border border-light space-y-2">
    <div class="flex items-center justify-between">
      <span class="block text-xs font-bold text-main font-heading">
        Jumlah Cabang / Lokasi Toko
      </span>
      <span class="text-3xs text-secondary font-mono">Maks {maxBranches} Cabang</span>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <button
        type="button"
        on:click={() => handleModeChange('single')}
        class="py-2 px-3 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer {branchMode === 'single'
          ? 'bg-primary text-primary-content border-primary shadow-2xs font-bold'
          : 'bg-card text-secondary border-light hover:text-main'}"
      >
        <Store size={14} />
        <span>1 Cabang Saja</span>
      </button>

      <button
        type="button"
        on:click={() => handleModeChange('multi')}
        class="py-2 px-3 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer {branchMode === 'multi'
          ? 'bg-primary text-primary-content border-primary shadow-2xs font-bold'
          : 'bg-card text-secondary border-light hover:text-main'}"
      >
        <Building2 size={14} />
        <span>Beberapa Cabang (Maks {maxBranches})</span>
      </button>
    </div>
  </div>

  <!-- Multi Branch Items Form -->
  {#if branchMode === 'multi'}
    <div class="space-y-3 animate-in fade-in duration-200">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-main font-heading">
          Daftar Cabang Toko ({branches.length}/{maxBranches})
        </span>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={branches.length >= maxBranches}
          on:click={addBranch}
          class="text-primary font-bold text-xs !px-2.5 !py-1 !h-auto gap-1"
        >
          <Plus size={14} />
          <span>Tambah Cabang</span>
        </Button>
      </div>

      {#each branches as branch, idx (branch.id || idx)}
        <div class="p-3 bg-card rounded-xl border border-light space-y-2.5 shadow-2xs">
          <div class="flex items-center justify-between border-b border-light/60 pb-1.5">
            <span class="text-xs font-bold text-main font-heading flex items-center gap-1.5">
              <Building2 size={13} class="text-primary" />
              Cabang #{idx + 1}
            </span>

            {#if branches.length > 1}
              <button
                type="button"
                on:click={() => removeBranch(idx)}
                class="p-1 rounded text-secondary hover:text-error transition-colors"
                title="Hapus Cabang Ini"
              >
                <Trash2 size={13} />
              </button>
            {/if}
          </div>

          <div>
            <label for={`branch-name-${idx}`} class="block text-3xs font-semibold text-secondary mb-1">
              Nama Cabang
            </label>
            <input
              id={`branch-name-${idx}`}
              type="text"
              value={branch.name}
              on:input={(e) => updateBranch(idx, 'name', e.currentTarget.value)}
              placeholder="Contoh: Cabang Rogojampi"
              class="w-full bg-nested text-main border border-light rounded-lg px-2.5 py-1.5 text-xs font-sans focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label for={`branch-addr-${idx}`} class="block text-3xs font-semibold text-secondary mb-1">
              Alamat Lengkap Cabang
            </label>
            <textarea
              id={`branch-addr-${idx}`}
              rows="2"
              value={branch.address}
              on:input={(e) => updateBranch(idx, 'address', e.currentTarget.value)}
              placeholder="Jl. Raya Rogojampi No. 45, Banyuwangi..."
              class="w-full bg-nested text-main border border-light rounded-lg p-2.5 text-xs font-sans focus:outline-none focus:border-primary resize-none"
            ></textarea>
          </div>

          <div>
            <label for={`branch-maps-${idx}`} class="block text-3xs font-semibold text-secondary mb-1">
              Link Google Maps Cabang
            </label>
            <div class="relative flex items-center">
              <input
                id={`branch-maps-${idx}`}
                type="url"
                value={branch.googleMapsUrl ?? ''}
                on:input={(e) => updateBranch(idx, 'googleMapsUrl', e.currentTarget.value)}
                placeholder="https://maps.app.goo.gl/..."
                class="w-full bg-nested text-main border border-light rounded-lg pl-7 pr-2.5 py-1.5 text-xs font-sans focus:outline-none focus:border-primary"
              />
              <div class="absolute left-2 flex items-center pointer-events-none text-muted">
                <MapPin size={12} />
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<script lang="ts">
  import { onMount } from 'svelte';
  import { Plus, Trash2, MapPin, Building2, Store } from 'lucide-svelte';
  import { Button, Input, Textarea } from '@/components/ui';
  import { apiFetch } from '@/lib/api/parse-response';
  import type { StoreBranchItem } from '../onboarding.types';

  export let branchMode: 'single' | 'multi' = 'single';
  export let branches: StoreBranchItem[] = [];
  export let primaryStoreName: string = '';
  export let primaryAddress: string = '';
  export let primaryMapsUrl: string = '';
  export let maxBranches: number = 5;

  onMount(async () => {
    try {
      const result = await apiFetch<{ maxStoreBranches?: number }>('/api/public/platform-settings');
      if (result.success && result.data && typeof result.data.maxStoreBranches === 'number') {
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

  function handleBranchFieldInput(
    idx: number,
    field: keyof StoreBranchItem,
    event: CustomEvent<Event>
  ) {
    const el = (event.detail.currentTarget ?? event.detail.target) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | null;
    if (el) updateBranch(idx, field, el.value);
  }
</script>

<div class="space-y-3 pt-2">
  <!-- Mode Selector: 1 Cabang vs Multi Cabang -->
  <div class="p-3 bg-nested rounded-xl border border-light space-y-2">
    <div class="flex items-center justify-between">
      <span class="block text-xs font-bold text-main font-heading">
        Jumlah Cabang / Lokasi Toko
      </span>
      <span class="text-xs text-secondary font-mono">Maks {maxBranches} Cabang</span>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <Button
        type="button"
        variant={branchMode === 'single' ? 'primary' : 'secondary'}
        size="sm"
        on:click={() => handleModeChange('single')}
        class="w-full gap-1.5 text-xs"
      >
        <Store size={14} />
        <span>1 Cabang Saja</span>
      </Button>

      <Button
        type="button"
        variant={branchMode === 'multi' ? 'primary' : 'secondary'}
        size="sm"
        on:click={() => handleModeChange('multi')}
        class="w-full gap-1.5 text-xs"
      >
        <Building2 size={14} />
        <span>Beberapa Cabang (Maks {maxBranches})</span>
      </Button>
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
              <Button
                type="button"
                variant="ghost"
                size="icon"
                on:click={() => removeBranch(idx)}
                class="text-secondary hover:text-error !h-6 !w-6 !min-h-0 !min-w-0 rounded"
                title="Hapus Cabang Ini"
                aria-label="Hapus Cabang Ini"
              >
                <Trash2 size={13} />
              </Button>
            {/if}
          </div>

          <Input
            id={`branch-name-${idx}`}
            label="Nama Cabang"
            size="sm"
            value={branch.name}
            on:input={(e) => handleBranchFieldInput(idx, 'name', e)}
            placeholder="Contoh: Cabang Rogojampi"
          />

          <Textarea
            id={`branch-addr-${idx}`}
            label="Alamat Lengkap Cabang"
            rows={2}
            resizable={false}
            value={branch.address}
            on:input={(e) => handleBranchFieldInput(idx, 'address', e)}
            placeholder="Jl. Raya Rogojampi No. 45, Banyuwangi..."
            class="text-xs rounded-xl"
          />

          <Input
            id={`branch-maps-${idx}`}
            label="Link Google Maps Cabang"
            size="sm"
            value={branch.googleMapsUrl ?? ''}
            on:input={(e) => handleBranchFieldInput(idx, 'googleMapsUrl', e)}
            placeholder="https://maps.app.goo.gl/..."
          >
            <MapPin size={12} slot="prefix" />
          </Input>
        </div>
      {/each}
    </div>
  {/if}
</div>

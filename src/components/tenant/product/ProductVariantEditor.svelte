<script lang="ts">
  import type { VariantGroup } from '../../../schemas/product-variant.schema';
  import { formatPriceAdjustment, parsePriceAdjustment } from './productForm.helpers';
  import Badge from '../../ui/Badge.svelte';
  import Button from '../../ui/Button.svelte';
  import { Trash2, X } from 'lucide-svelte';

  export let variantGroups: VariantGroup[] = [];
  export let fieldErrors: Record<string, string> = {};

  function addVariantGroup() {
    if (variantGroups.length >= 5) return;
    variantGroups = [
      ...variantGroups,
      { groupName: "", options: [{ name: "", priceAdjustment: 0, isAvailable: true }] },
    ];
  }

  function removeVariantGroup(groupIndex: number) {
    variantGroups = variantGroups.filter((_, i) => i !== groupIndex);
  }

  function addVariantOption(groupIndex: number) {
    if (variantGroups[groupIndex].options.length >= 20) return;
    variantGroups[groupIndex].options = [
      ...variantGroups[groupIndex].options,
      { name: "", priceAdjustment: 0, isAvailable: true },
    ];
    variantGroups = [...variantGroups];
  }

  function removeVariantOption(groupIndex: number, optionIndex: number) {
    variantGroups[groupIndex].options = variantGroups[groupIndex].options.filter(
      (_, i) => i !== optionIndex,
    );
    if (variantGroups[groupIndex].options.length === 0) {
      removeVariantGroup(groupIndex);
    } else {
      variantGroups = [...variantGroups];
    }
  }
</script>

<div class="mb-4">
  <div class="flex items-center justify-between mb-3">
    <div class="text-xs font-bold text-main block font-heading mb-0">
      Varian Produk
      {#if variantGroups.length > 0}
        <Badge size="sm" variant="secondary" dot={false}>{variantGroups.length}/5 grup</Badge>
      {/if}
    </div>
    {#if variantGroups.length < 5}
      <Button
        type="button"
        variant="ghost"
        size="xs"
        class="text-primary font-medium"
        on:click={addVariantGroup}
      >
        + Tambah Grup
      </Button>
    {/if}
  </div>

  {#if variantGroups.length === 0}
    <div class="border border-dashed border-base-300 rounded-xl p-4 text-center">
      <p class="text-sm text-base-content/50">
        Belum ada varian. Klik "Tambah Grup" untuk menambahkan varian seperti Ukuran, Warna, dll.
      </p>
    </div>
  {/if}

  {#each variantGroups as group, gi}
    <div class="border border-light rounded-xl p-4 mb-3 bg-nested/50">
      <div class="flex items-center gap-2 mb-3">
        <input
          type="text"
          class="input input-bordered input-sm flex-1 rounded-xl bg-nested text-main font-sans text-xs focus:border-primary focus:outline-none"
          class:input-error={fieldErrors[`variantGroup_${gi}`]}
          bind:value={group.groupName}
          placeholder="Nama grup (contoh: Ukuran, Warna)"
        />
        <Button
          type="button"
          variant="ghost"
          size="xs"
          class="hover:bg-error/10 hover:text-error text-error/70 p-1.5 h-auto min-h-0"
          on:click={() => removeVariantGroup(gi)}
          ariaLabel="Hapus grup"
        >
          <Trash2 size={16} />
        </Button>
      </div>
      {#if fieldErrors[`variantGroup_${gi}`]}
        <span class="text-error text-xs mb-2 block">{fieldErrors[`variantGroup_${gi}`]}</span>
      {/if}

      <!-- Option rows -->
      <div class="space-y-2">
        {#each group.options as option, oi}
          <div class="flex items-center gap-2">
            <input
              type="text"
              class="input input-bordered input-xs flex-1 rounded-lg bg-nested text-main font-sans focus:border-primary focus:outline-none h-8 px-3"
              class:input-error={fieldErrors[`variantOption_${gi}_${oi}`]}
              bind:value={option.name}
              placeholder="Nama opsi (contoh: S, M, L)"
            />
            <div class="relative">
              <input
                type="text"
                class="input input-bordered input-xs w-28 rounded-lg bg-nested text-main font-sans focus:border-primary focus:outline-none h-8 px-3 text-right"
                value={formatPriceAdjustment(option.priceAdjustment)}
                on:input={(e) => {
                  option.priceAdjustment = parsePriceAdjustment(e.currentTarget.value);
                  variantGroups = [...variantGroups];
                }}
                placeholder="Selisih harga"
                title="Selisih harga dari harga dasar (contoh: +5000 atau -2000)"
              />
            </div>
            <input
              type="checkbox"
              class="toggle toggle-xs toggle-success"
              bind:checked={option.isAvailable}
              title={option.isAvailable ? "Tersedia" : "Tidak tersedia"}
            />
            <Button
              type="button"
              variant="ghost"
              size="xs"
              class="text-base-content/40 hover:text-error p-1.5 h-auto min-h-0"
              on:click={() => removeVariantOption(gi, oi)}
              ariaLabel="Hapus opsi"
            >
              <X size={14} />
            </Button>
          </div>
          {#if fieldErrors[`variantOption_${gi}_${oi}`]}
            <span class="text-error text-xs">{fieldErrors[`variantOption_${gi}_${oi}`]}</span>
          {/if}
        {/each}
      </div>

      {#if group.options.length < 20}
        <Button
          type="button"
          variant="ghost"
          size="xs"
          class="text-primary/70 mt-2 font-normal"
          on:click={() => addVariantOption(gi)}
        >
          + Tambah Opsi
        </Button>
      {/if}
      <div class="text-xs text-base-content/40 mt-1">
        {group.options.length}/20 opsi
      </div>
    </div>
  {/each}
</div>

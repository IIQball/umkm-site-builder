<script lang="ts">
  import type { VariantGroup } from '../../../schemas/product-variant.schema';
  import { formatPriceAdjustment, parsePriceAdjustment } from './productForm.helpers';

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
    <span class="block text-label-caps text-muted mb-0">
      Varian Produk
      {#if variantGroups.length > 0}
        <span class="badge badge-sm bg-nested border-none ml-1 text-main font-sans">{variantGroups.length}/5 grup</span>
      {/if}
    </span>
    {#if variantGroups.length < 5}
      <button
        type="button"
        class="btn btn-xs btn-ghost text-primary font-medium"
        on:click={addVariantGroup}
      >
        + Tambah Grup
      </button>
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
          class="input input-bordered input-sm flex-1 rounded-xl bg-nested text-main font-sans text-xs focus:border-blue-500 focus:outline-none"
          class:input-error={fieldErrors[`variantGroup_${gi}`]}
          bind:value={group.groupName}
          placeholder="Nama grup (contoh: Ukuran, Warna)"
        />
        <button
          type="button"
          class="btn btn-xs btn-ghost hover:bg-error/10 hover:text-error text-error/70"
          on:click={() => removeVariantGroup(gi)}
          title="Hapus grup"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
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
              class="input input-bordered input-xs flex-1 rounded-lg bg-nested text-main font-sans focus:border-blue-500 focus:outline-none h-8 px-3"
              class:input-error={fieldErrors[`variantOption_${gi}_${oi}`]}
              bind:value={option.name}
              placeholder="Nama opsi (contoh: S, M, L)"
            />
            <div class="relative">
              <input
                type="text"
                class="input input-bordered input-xs w-28 rounded-lg bg-nested text-main font-sans focus:border-blue-500 focus:outline-none h-8 px-3 text-right"
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
            <button
              type="button"
              class="btn btn-xs btn-ghost text-base-content/40 hover:text-error"
              on:click={() => removeVariantOption(gi, oi)}
              title="Hapus opsi"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {#if fieldErrors[`variantOption_${gi}_${oi}`]}
            <span class="text-error text-xs">{fieldErrors[`variantOption_${gi}_${oi}`]}</span>
          {/if}
        {/each}
      </div>

      {#if group.options.length < 20}
        <button
          type="button"
          class="btn btn-xs btn-ghost text-primary/70 mt-2 font-normal"
          on:click={() => addVariantOption(gi)}
        >
          + Tambah Opsi
        </button>
      {/if}
      <div class="text-xs text-base-content/40 mt-1">
        {group.options.length}/20 opsi
      </div>
    </div>
  {/each}
</div>

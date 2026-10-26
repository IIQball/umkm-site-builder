<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Modal, Button, Badge, Select } from '@/components/ui';
  import {
    getFeatureTypeBadgeConfig,
    type AiAssetItem,
  } from './gallery.constants';
  import { formatDate } from '@/lib/utils/format';

  export let open: boolean = false;
  export let asset: AiAssetItem | null = null;
  export let products: Array<{ id: string; name: string }> = [];
  export let loading: boolean = false;

  const dispatch = createEventDispatcher<{
    close: void;
    attach: { productId: string; cloudinaryUrl: string; attachmentType: string };
  }>();

  let selectedProductId: string = '';
  let isAttaching = false;

  function handleClose() {
    open = false;
    selectedProductId = '';
    dispatch('close');
  }

  async function handleAttach() {
    if (!asset || !selectedProductId || isAttaching) return;

    isAttaching = true;
    try {
      dispatch('attach', {
        productId: selectedProductId,
        cloudinaryUrl: asset.cloudinaryUrl,
        attachmentType: asset.featureType,
      });
    } finally {
      isAttaching = false;
    }
  }

  $: badgeConfig = asset ? getFeatureTypeBadgeConfig(asset.featureType) : { label: '', variant: 'slate' as const };
  $: sizeLabel = asset?.sizeRatio === '2:3' ? 'Format Vertikal (2:3)' : 'Format Persegi (1:1)';
  $: canAttach = selectedProductId && !isAttaching && !loading;
</script>

<Modal
  {open}
  title={asset ? `Pasang ke Produk: ${badgeConfig.label}` : 'Pasang ke Produk'}
  description={asset ? `Dibuat pada ${formatDate(asset.createdAt)} • ${sizeLabel}` : ''}
  size="lg"
  on:close={handleClose}
>
  {#if asset}
    <div class="space-y-6">
      <!-- Pratinjau Gambar -->
      <div class="relative w-full aspect-square sm:aspect-[4/3] bg-nested rounded-2xl overflow-hidden border border-light flex items-center justify-center p-2">
        <img
          src={asset.cloudinaryUrl}
          alt="Pratinjau Visual"
          class="max-w-full max-h-full object-contain rounded-xl"
          loading="lazy"
        />
        <div class="absolute top-3 right-3 flex items-center gap-1.5">
          <Badge variant={badgeConfig.variant} size="sm" dot={true}>
            {badgeConfig.label}
          </Badge>
          <Badge variant="slate" size="sm" dot={false}>
            {sizeLabel}
          </Badge>
        </div>
      </div>

      <!-- Pilihan Produk -->
      <div class="space-y-2">
        <label class="block text-label-caps text-muted">
          Pilih Produk untuk Dipasang <span class="text-error">*</span>
        </label>
        <Select
          bind:value={selectedProductId}
          placeholder="Pilih produk..."
          options={products.map(p => ({ value: p.id, label: p.name }))}
          disabled={loading || isAttaching}
          error={!selectedProductId && isAttaching ? 'Pilih produk terlebih dahulu' : ''}
        />
        <p class="text-xs text-secondary">
          Gambar akan ditambahkan ke galeri produk tanpa perlu download dan upload ulang.
        </p>
      </div>
    </div>
  {/if}

  <svelte:fragment slot="footer">
    <div class="flex flex-wrap items-center justify-end gap-3 w-full">
      <Button
        variant="ghost"
        size="sm"
        on:click={handleClose}
        disabled={isAttaching || loading}
      >
        Batal
      </Button>
      <Button
        variant="primary"
        size="sm"
        on:click={handleAttach}
        disabled={!canAttach}
        loading={isAttaching}
      >
        {#if isAttaching}
          Memasang...
        {:else}
          Pasang ke Produk
        {/if}
      </Button>
    </div>
  </svelte:fragment>
</Modal>

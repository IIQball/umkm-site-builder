<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Modal } from '@/components/ui';
  import type { AiAssetItem } from './gallery.constants';
  import AiProductAttachCardList from './AiProductAttachCardList.svelte';

  export let open: boolean = false;
  export let asset: AiAssetItem | null = null;
  export let storeId: string = '';

  const dispatch = createEventDispatcher<{
    close: void;
    attached: void;
  }>();

  function handleClose() {
    open = false;
    dispatch('close');
  }

  function handleAttached() {
    open = false;
    dispatch('attached');
    dispatch('close');
  }
</script>

<Modal
  {open}
  title="Pasang Desain ke Produk"
  description="Pilih produk yang ingin dipasangi desain ini"
  size="lg"
  on:close={handleClose}
>
  {#if asset}
    <div class="space-y-4">
      <AiProductAttachCardList
        {storeId}
        imageUrl={asset.cloudinaryUrl}
        featureType={asset.featureType}
        on:attached={handleAttached}
        on:cancel={handleClose}
      />
    </div>
  {/if}
</Modal>

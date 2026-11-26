<script lang="ts">
  import { Modal, Input, Button } from '@/components/ui';
  import { toast } from '@/lib/toast';
  import { apiFetch } from '@/lib/api/parse-response';
  import type { AdminUserItem } from '@/types';

  export let isOpen = false;
  export let selectedUser: AdminUserItem | null = null;
  export let onClose: () => void;
  export let suggestedAddProducts = 0;
  export let suggestedAddCategories = 0;

  let maxProducts = 10;
  let maxCategories = 5;
  let currentMaxProducts = 10;
  let currentMaxCategories = 5;
  let isLoading = false;
  let isFetching = false;

  $: if (isOpen && selectedUser) {
    fetchCurrentQuota(selectedUser.id);
  }

  async function fetchCurrentQuota(userId: string) {
    isFetching = true;
    try {
      const res = await apiFetch<{ maxProducts: number; maxCategories: number }>(
        `/api/admin/users/${userId}/quota`,
        { fallbackError: 'Gagal memuat kuota saat ini' }
      );
      if (res.success && res.data) {
        currentMaxProducts = res.data.maxProducts;
        currentMaxCategories = res.data.maxCategories;
        maxProducts = currentMaxProducts + (suggestedAddProducts || 0);
        maxCategories = currentMaxCategories + (suggestedAddCategories || 0);
      } else {
        toast.error(res.message);
        onClose();
      }
    } catch {
      toast.error('Terjadi kesalahan jaringan');
    } finally {
      isFetching = false;
    }
  }

  async function submitQuota() {
    if (!selectedUser) return;
    isLoading = true;
    try {
      const res = await apiFetch<{ message?: string }>(`/api/admin/users/${selectedUser.id}/quota`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maxProducts, maxCategories }),
        fallbackError: 'Gagal memperbarui kuota',
      });
      if (res.success) {
        toast.success(res.message || res.data?.message || 'Kuota berhasil diperbarui');
        onClose();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Terjadi kesalahan sistem');
    } finally {
      isLoading = false;
    }
  }
</script>

<Modal bind:open={isOpen} size="sm" title="Kelola Kuota Merchant" on:close={onClose}>
  <div class="flex flex-col gap-4 -mt-2 pb-2">
    <p class="text-sm text-secondary leading-relaxed">
      Ubah batas maksimal produk dan kategori untuk merchant <strong>{selectedUser?.name || 'ini'}</strong>.
      {#if suggestedAddProducts > 0 || suggestedAddCategories > 0}
        <br/><span class="text-primary font-medium mt-1 inline-block">
          (Ada pengajuan penambahan: {suggestedAddProducts > 0 ? `+${suggestedAddProducts} Produk` : ''} {suggestedAddProducts > 0 && suggestedAddCategories > 0 ? '&' : ''} {suggestedAddCategories > 0 ? `+${suggestedAddCategories} Kategori` : ''})
        </span>
      {/if}
    </p>

    {#if isFetching}
      <div class="flex justify-center items-center py-4">
        <span class="loading loading-spinner text-primary"></span>
      </div>
    {:else}
      <div class="space-y-4 mt-1">
        <div class="space-y-1">
          <Input
            type="number"
            label="Batas Maksimal Produk"
            min={1}
            bind:value={maxProducts}
            class="no-spinners"
          />
          <p class="text-[11px] text-muted font-medium ml-1">Limit toko saat ini: {currentMaxProducts} Produk</p>
        </div>
        <div class="space-y-1">
          <Input
            type="number"
            label="Batas Maksimal Kategori"
            min={1}
            bind:value={maxCategories}
            class="no-spinners"
          />
          <p class="text-[11px] text-muted font-medium ml-1">Limit toko saat ini: {currentMaxCategories} Kategori</p>
        </div>
      </div>
    {/if}
  </div>

  <svelte:fragment slot="footer">
    <Button variant="secondary" on:click={onClose} disabled={isLoading || isFetching}>
      Batal
    </Button>
    <Button variant="primary" on:click={submitQuota} disabled={isLoading || isFetching} loading={isLoading}>
      Simpan Perubahan
    </Button>
  </svelte:fragment>
</Modal>

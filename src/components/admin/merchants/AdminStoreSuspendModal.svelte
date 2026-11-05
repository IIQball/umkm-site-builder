<script lang="ts">
  import { Modal, Button, Textarea } from '@/components/ui';
  import { addToast } from '@/lib/toast';
  import type { AssistedStoreItem } from '@/types/admin';

  export let open: boolean = false;
  export let isUnsuspend: boolean = false;
  export let store: AssistedStoreItem | null = null;

  let reason: string = '';
  let loading: boolean = false;

  async function handleSuspend() {
    if (!store?.id || !reason.trim()) {
      addToast({
        type: 'error',
        message: 'Alasan penangguhan wajib diisi',
      });
      return;
    }

    loading = true;
    try {
      const response = await fetch(`/api/admin/stores/${store.id}/suspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        addToast({
          type: 'error',
          message: result.error?.message || 'Gagal menangguhkan toko',
        });
        return;
      }

      addToast({
        type: 'success',
        message: `Toko "${store.name}" telah ditangguhkan`,
      });

      close();
      window.location.reload();
    } catch (error) {
      console.error('[AdminStoreSuspendModal] Error suspend:', error);
      addToast({
        type: 'error',
        message: 'Terjadi kesalahan saat menangguhkan toko',
      });
    } finally {
      loading = false;
    }
  }

  async function handleUnsuspend() {
    if (!store?.id) return;

    loading = true;
    try {
      const response = await fetch(`/api/admin/stores/${store.id}/unsuspend`, {
        method: 'POST',
      });

      const result = await response.json();

      if (!response.ok) {
        addToast({
          type: 'error',
          message: result.error?.message || 'Gagal memulihkan toko',
        });
        return;
      }

      addToast({
        type: 'success',
        message: `Toko "${store.name}" telah dipulihkan dan aktif kembali`,
      });

      close();
      window.location.reload();
    } catch (error) {
      console.error('[AdminStoreSuspendModal] Error unsuspend:', error);
      addToast({
        type: 'error',
        message: 'Terjadi kesalahan saat memulihkan toko',
      });
    } finally {
      loading = false;
    }
  }

  function close() {
    open = false;
    reason = '';
  }
</script>

<Modal
  {open}
  title={isUnsuspend ? "Pulihkan Toko" : "Tangguhkan Toko"}
  description={store
    ? isUnsuspend
      ? `Pulihkan toko "${store.name}" dari ${store.tenantName} agar kembali aktif`
      : `Tangguhkan toko "${store.name}" dari ${store.tenantName}`
    : ''}
  size="md"
  on:close={close}
>
  {#if isUnsuspend}
    <div class="space-y-3 py-1">
      <div class="p-3.5 bg-success/10 border border-success/20 rounded-xl text-xs text-main flex items-start gap-2.5">
        <span class="material-symbols-outlined text-success text-base flex-shrink-0 mt-0.5">check_circle</span>
        <div class="space-y-1">
          <p class="font-bold text-success">Konfirmasi Pemulihan Toko</p>
          <p class="text-secondary leading-relaxed">
            Apakah Anda yakin ingin mengaktifkan kembali toko <strong class="text-main">{store?.name}</strong>? Status toko akan kembali aktif dan dapat diakses pembeli melalui subdomain.
          </p>
        </div>
      </div>
    </div>
  {:else}
    <div class="space-y-4">
      <Textarea
        id="suspend-reason"
        label="Alasan Penangguhan"
        helper="Alasan ini akan diinformasikan kepada pemilik toko"
        placeholder="Jelaskan alasan penangguhan toko..."
        bind:value={reason}
        rows={4}
        resizable={false}
        required
      />
    </div>
  {/if}

  <svelte:fragment slot="footer">
    <Button
      variant="secondary"
      size="sm"
      on:click={close}
      disabled={loading}
    >
      Batal
    </Button>
    {#if isUnsuspend}
      <Button
        variant="primary"
        size="sm"
        loading={loading}
        on:click={handleUnsuspend}
      >
        Pulihkan Toko
      </Button>
    {:else}
      <Button
        variant="destructive"
        size="sm"
        loading={loading}
        on:click={handleSuspend}
      >
        Tangguhkan Toko
      </Button>
    {/if}
  </svelte:fragment>
</Modal>

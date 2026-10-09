<script lang="ts">
  import { Modal, Button } from '@/components/ui';
  import { addToast } from '@/lib/toast';
  import type { AssistedStoreItem } from '@/types/admin';

  export let open: boolean = false;
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
      // Trigger page refresh or parent component update
      window.location.reload();
    } catch (error) {
      console.error('[AdminStoreSuspendModal] Error:', error);
      addToast({
        type: 'error',
        message: 'Terjadi kesalahan saat menangguhkan toko',
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
  title="Tangguhkan Toko"
  description={store ? `Tangguhkan toko "${store.name}" dari ${store.tenantName}` : ''}
  size="md"
  on:close={close}
>
  <div class="space-y-4">
    <div>
      <label for="suspend-reason" class="block text-sm font-semibold text-main mb-2">
        Alasan Penangguhan
      </label>
      <textarea
        id="suspend-reason"
        bind:value={reason}
        placeholder="Jelaskan alasan penangguhan toko..."
        class="w-full px-4 py-3 rounded-xl border border-light bg-card text-main placeholder:text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none"
        rows="4"
      />
      <p class="text-xs text-secondary mt-1">
        Alasan ini akan diinformasikan kepada pemilik toko
      </p>
    </div>
  </div>

  <svelte:fragment slot="footer">
    <Button
      variant="secondary"
      size="sm"
      on:click={close}
      disabled={loading}
      className="rounded-lg"
    >
      Batal
    </Button>
    <Button
      variant="primary"
      size="sm"
      loading={loading}
      on:click={handleSuspend}
      className="rounded-lg"
    >
      Tangguhkan Toko
    </Button>
  </svelte:fragment>
</Modal>

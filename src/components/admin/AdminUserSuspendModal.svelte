<script lang="ts">
  import type { AdminUserItem } from '@/types';

  export let isOpen = false;
  export let isUnsuspend = false;
  export let selectedUser: AdminUserItem | null = null;
  export let suspendReason = '';
  export let actionLoading = false;
  export let onSubmit: (status: 'active' | 'suspended') => void = () => {};
  export let onClose: () => void = () => {};
</script>

{#if isOpen && selectedUser}
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-card border border-light rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4 animate-fade-in">
      {#if isUnsuspend}
        <h3 class="font-bold text-sm text-main">Aktifkan Pengguna</h3>
        <p class="text-xs text-secondary leading-relaxed">Apakah Anda yakin ingin mengaktifkan kembali akun <strong>{selectedUser.name}</strong>?</p>
        <div class="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            class="inline-flex items-center justify-center text-xs font-bold text-secondary hover:text-main hover:bg-nested rounded-xl px-4 py-2.5 transition-colors cursor-pointer"
            on:click={onClose}
            disabled={actionLoading}
          >
            Batal
          </button>
          <button
            type="button"
            class="btn btn-sm bg-success border-none text-white text-xs font-bold rounded-xl px-4 py-2.5 transition-all cursor-pointer"
            on:click={() => onSubmit('active')}
            disabled={actionLoading}
          >
            {actionLoading ? 'Memproses...' : 'Aktifkan Akun'}
          </button>
        </div>
      {:else}
        <h3 class="font-bold text-sm text-main">Tangguhkan Pengguna</h3>
        <p class="text-xs text-secondary leading-relaxed">Berikan alasan penangguhan untuk akun <strong>{selectedUser.name}</strong>:</p>
        <textarea 
          bind:value={suspendReason} 
          placeholder="Alasan penangguhan (min 5 karakter)..." 
          class="w-full px-3 py-2 bg-nested text-main border border-light focus:border-primary rounded-xl text-xs font-semibold focus:outline-none transition-colors h-24"
        ></textarea>
        <div class="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            class="inline-flex items-center justify-center text-xs font-bold text-secondary hover:text-main hover:bg-nested rounded-xl px-4 py-2.5 transition-colors cursor-pointer"
            on:click={onClose}
            disabled={actionLoading}
          >
            Batal
          </button>
          <button
            type="button"
            class="btn btn-sm bg-error border-none text-white text-xs font-bold rounded-xl px-4 py-2.5 transition-all cursor-pointer"
            on:click={() => onSubmit('suspended')}
            disabled={actionLoading || suspendReason.trim().length < 5}
          >
            {actionLoading ? 'Memproses...' : 'Tangguhkan'}
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}

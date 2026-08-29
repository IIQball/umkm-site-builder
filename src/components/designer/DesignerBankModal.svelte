<script lang="ts">
  import { X } from 'lucide-svelte';
  import type { BankAccount } from '@/types';

  export let showModal = false;
  export let bankAccount: BankAccount | null = null;
  export let inputBankName = 'BCA';
  export let inputAccountNumber = '';
  export let inputHolderName = '';
  export let isLoading = false;
  export let apiError = '';
  export let onSave: () => void = () => {};
  export let onClose: () => void = () => {};

  const popularBanks = ['BCA', 'Mandiri', 'BNI', 'BRI', 'CIMB Niaga', 'Permata'];

  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return {
      destroy() {
        if (node.parentNode) node.parentNode.removeChild(node);
      }
    };
  }
</script>

{#if showModal}
  <div use:portal class="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-card border border-light rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-fade-in relative z-10">
      <div class="flex justify-between items-center pb-2 border-b border-light">
        <h3 class="text-heading-md font-bold text-main">{bankAccount ? 'Ganti Rekening Bank' : 'Hubungkan Rekening Bank'}</h3>
        <button
          type="button"
          on:click={onClose}
          disabled={isLoading}
          class="text-muted hover:text-main flex items-center disabled:opacity-50 cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      <div class="space-y-3">
        <div class="space-y-1">
          <label class="block text-label-caps text-muted mb-1" for="select-bank">Nama Bank</label>
          <select
            id="select-bank"
            bind:value={inputBankName}
            disabled={isLoading}
            class="w-full bg-nested border border-light rounded-xl px-3 py-2 text-xs text-main outline-none focus:border-primary disabled:opacity-50"
          >
            {#each popularBanks as bank}
              <option value={bank}>{bank}</option>
            {/each}
          </select>
        </div>

        <div class="space-y-1">
          <label class="block text-label-caps text-muted mb-1" for="input-norek">Nomor Rekening</label>
          <input
            id="input-norek"
            type="text"
            placeholder="Contoh: 7128391829"
            bind:value={inputAccountNumber}
            disabled={isLoading}
            class="w-full bg-nested border border-light rounded-xl px-3 py-2 text-xs text-main outline-none focus:border-primary font-mono disabled:opacity-50"
          />
        </div>

        <div class="space-y-1">
          <label class="block text-label-caps text-muted mb-1" for="input-nama">Nama Pemilik Rekening</label>
          <input
            id="input-nama"
            type="text"
            placeholder="Nama lengkap sesuai tabungan"
            bind:value={inputHolderName}
            disabled={isLoading}
            class="w-full bg-nested border border-light rounded-xl px-3 py-2 text-xs text-main outline-none focus:border-primary disabled:opacity-50"
          />
        </div>
        
        {#if apiError}
          <div class="text-xs font-semibold text-error pt-1">{apiError}</div>
        {/if}
      </div>

      <div class="flex gap-2 pt-2">
        <button
          type="button"
          on:click={onClose}
          disabled={isLoading}
          class="btn btn-sm text-xs font-bold text-secondary bg-nested hover:bg-nested/80 rounded-xl py-2 px-3 transition-colors border border-light disabled:opacity-50 cursor-pointer"
        >
          Batal
        </button>
        <button
          type="button"
          on:click={onSave}
          disabled={isLoading}
          class="btn btn-sm btn-primary text-xs font-bold text-white rounded-xl py-2 px-3 transition-colors text-center flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {#if isLoading}
            <span class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Menyimpan...
          {:else}
            Simpan Rekening
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}
